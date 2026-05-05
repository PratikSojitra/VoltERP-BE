import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment } from './schemas/payment.schema';
import { Invoice } from '../invoice/schemas/invoice.schema';
import { Customer } from '../customer/schemas/customer.schema';
import { Purchase } from '../purchase/schemas/purchase.schema';
import { Vendor } from '../vendor/schemas/vendor.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
        @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
        @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
        @InjectModel(Purchase.name) private readonly purchaseModel: Model<Purchase>,
        @InjectModel(Vendor.name) private readonly vendorModel: Model<Vendor>,
    ) { }

    private async syncInvoice(invoiceId: string | Types.ObjectId) {
        if (!invoiceId) return;

        // There should only be ONE payment record per invoice now.
        const payment = await this.paymentModel.findOne({ invoice: invoiceId });
        
        const totalPaid = payment ? payment.amount : 0;
        const invoice = await this.invoiceModel.findById(invoiceId);

        if (!invoice) return;

        const outstandingAmount = invoice.grandTotal - totalPaid;

        let status = 'UNPAID';
        if (outstandingAmount <= 0) {
            status = 'PAID';
        } else if (totalPaid > 0) {
            status = 'PARTIAL';
        }

        invoice.paidAmount = totalPaid;
        invoice.outstandingAmount = outstandingAmount > 0 ? outstandingAmount : 0;
        invoice.status = status;
        await invoice.save();
    }

    private async syncPurchase(purchaseId: string | Types.ObjectId) {
        if (!purchaseId) return;

        const payment = await this.paymentModel.findOne({ purchase: purchaseId });
        const totalPaid = payment ? payment.amount : 0;
        const purchase = await this.purchaseModel.findById(purchaseId);

        if (!purchase) return;

        const outstandingAmount = purchase.grandTotal - totalPaid;

        purchase.paidAmount = totalPaid;
        purchase.outstandingAmount = outstandingAmount > 0 ? outstandingAmount : 0;
        await purchase.save();
    }

    async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
        if (!createPaymentDto.type) {
            createPaymentDto.type = createPaymentDto.purchase ? 'PURCHASE' : 'SALES';
        }

        const invoiceId = createPaymentDto.invoice;
        const purchaseId = createPaymentDto.purchase;

        // Check if a payment document already exists for this invoice/purchase
        if (invoiceId || purchaseId) {
            const query: any = {};
            if (invoiceId) query.invoice = invoiceId;
            if (purchaseId) query.purchase = purchaseId;
            
            const existing = await this.paymentModel.findOne(query).exec();
            if (existing) {
                return this.update(existing._id.toString(), createPaymentDto);
            }
        }

        const amount = createPaymentDto.amount || 0;
        let outstanding = 0;
        
        if (invoiceId) {
            const invoice = await this.invoiceModel.findById(invoiceId);
            if (invoice) outstanding = invoice.grandTotal || 0;
        } else if (purchaseId) {
            const purchase = await this.purchaseModel.findById(purchaseId);
            if (purchase) outstanding = purchase.grandTotal || 0;
        }

        if (outstanding > 0) {
            if (amount === 0) createPaymentDto.status = 'PENDING';
            else if (amount < outstanding) createPaymentDto.status = 'PARTIAL';
            else createPaymentDto.status = 'COMPLETED';
        }

        // Create the initial history record if an amount was provided
        const history: any[] = [];
        if (amount > 0) {
            history.push({
                amount: amount,
                paymentDate: createPaymentDto.paymentDate || new Date(),
                paymentMethod: createPaymentDto.paymentMethod || 'OTHER',
                referenceNumber: createPaymentDto.referenceNumber,
                notes: createPaymentDto.notes
            });
        }

        const createdPayment = new this.paymentModel({
            ...createPaymentDto,
            history
        });
        
        const saved = await createdPayment.save();
        if (saved.invoice) await this.syncInvoice(saved.invoice);
        if (saved.purchase) await this.syncPurchase(saved.purchase);
        return saved;
    }

    async findAll(
        companyId?: string, 
        page: number = 1, 
        limit: number = 10, 
        search?: string,
        status?: string,
        startDate?: string,
        endDate?: string,
        type?: string
    ) {
        let filter: any = companyId ? { company: companyId } : {};

        if (status) {
            filter.status = status;
        }

        if (type) {
            if (type === 'SALES') {
                // In MongoDB, { $in: ['SALES', null] } matches both explicitly null 
                // and missing fields (legacy data).
                filter.type = { $in: ['SALES', null] };
            } else {
                filter.type = type;
            }
        }

        if (startDate || endDate) {
            filter.paymentDate = {};
            if (startDate) {
                filter.paymentDate.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.paymentDate.$lte = new Date(endDate);
            }
        }

        if (search) {
            // Search for matching customers, vendors, invoices, and purchases
            const [matchingCustomers, matchingInvoices, matchingVendors, matchingPurchases] = await Promise.all([
                this.customerModel.find({
                    name: { $regex: search, $options: 'i' },
                    ...(companyId ? { company: companyId } : {})
                }).select('_id').exec(),
                this.invoiceModel.find({
                    invoiceNumber: { $regex: search, $options: 'i' },
                    ...(companyId ? { company: companyId } : {})
                }).select('_id').exec(),
                this.vendorModel.find({
                    name: { $regex: search, $options: 'i' },
                    ...(companyId ? { company: companyId } : {})
                }).select('_id').exec(),
                this.purchaseModel.find({
                    invoiceNumber: { $regex: search, $options: 'i' },
                    ...(companyId ? { company: companyId } : {})
                }).select('_id').exec()
            ]);

            const customerIds = matchingCustomers.map(c => c._id);
            const invoiceIds = matchingInvoices.map(i => i._id);
            const vendorIds = matchingVendors.map(v => v._id);
            const purchaseIds = matchingPurchases.map(p => p._id);

            filter.$or = [
                { referenceNumber: { $regex: search, $options: 'i' } },
                { paymentMethod: { $regex: search, $options: 'i' } },
                { customer: { $in: customerIds } },
                { invoice: { $in: invoiceIds } },
                { vendor: { $in: vendorIds } },
                { purchase: { $in: purchaseIds } }
            ];
            // Only add status to $or search if we aren't already specifically filtering by it
            if (!status) {
                filter.$or.push({ status: { $regex: search, $options: 'i' } });
            }
        }
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.paymentModel
                .find(filter)
                .skip(skip)
                .limit(limit)
                .populate('customer')
                .populate('vendor')
                .populate('company')
                .populate('invoice')
                .populate('purchase')
                .sort({ createdAt: -1 })
                .exec(),
            this.paymentModel.countDocuments(filter).exec()
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findOne(id: string): Promise<Payment> {
        const payment = await this.paymentModel
            .findById(id)
            .populate('customer')
            .populate('vendor')
            .populate('company')
            .populate('invoice')
            .populate('purchase')
            .exec();
        if (!payment) {
            throw new NotFoundException(`Payment record with ID "${id}" not found`);
        }
        return payment;
    }

    async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
        const existingPayment = await this.paymentModel.findById(id);
        if (!existingPayment) {
            throw new NotFoundException(`Payment record with ID "${id}" not found`);
        }

        const partialAmount = updatePaymentDto.amount || 0;
        
        if (partialAmount > 0) {
            existingPayment.history.push({
                amount: partialAmount,
                paymentDate: updatePaymentDto.paymentDate || new Date(),
                paymentMethod: updatePaymentDto.paymentMethod || 'OTHER',
                referenceNumber: updatePaymentDto.referenceNumber,
                notes: updatePaymentDto.notes
            });
            
            existingPayment.amount += partialAmount;
            existingPayment.paymentDate = updatePaymentDto.paymentDate ? new Date(updatePaymentDto.paymentDate) : new Date();
            existingPayment.paymentMethod = updatePaymentDto.paymentMethod || 'OTHER';
            existingPayment.referenceNumber = updatePaymentDto.referenceNumber || '';
            existingPayment.notes = updatePaymentDto.notes || '';
        }

        const totalAmount = existingPayment.amount;
        let outstanding = 0;
        const invoiceId = existingPayment.invoice;
        const purchaseId = existingPayment.purchase;

        if (invoiceId) {
            const invoice = await this.invoiceModel.findById(invoiceId);
            if (invoice) outstanding = invoice.grandTotal;
        } else if (purchaseId) {
            const purchase = await this.purchaseModel.findById(purchaseId);
            if (purchase) outstanding = purchase.grandTotal;
        }

        if (outstanding > 0) {
            if (totalAmount === 0) existingPayment.status = 'PENDING';
            else if (totalAmount < outstanding) existingPayment.status = 'PARTIAL';
            else existingPayment.status = 'COMPLETED';
        }

        const updatedPayment = await existingPayment.save();

        if (updatedPayment && updatedPayment.invoice) await this.syncInvoice(updatedPayment.invoice);
        if (updatedPayment && updatedPayment.purchase) await this.syncPurchase(updatedPayment.purchase);
        
        return updatedPayment;
    }

    async remove(id: string): Promise<Payment> {
        const deletedPayment = await this.paymentModel.findByIdAndDelete(id).exec();
        if (!deletedPayment) {
            throw new NotFoundException(`Payment record with ID "${id}" not found`);
        }
        if (deletedPayment.invoice) await this.syncInvoice(deletedPayment.invoice);
        if (deletedPayment.purchase) await this.syncPurchase(deletedPayment.purchase);
        return deletedPayment;
    }
}
