import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Inventory } from '../inventory/schemas/inventory.schema';
import { Payment } from '../payment/schemas/payment.schema';
import { Customer } from '../customer/schemas/customer.schema';

@Injectable()
export class InvoiceService {
    constructor(
        @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
        @InjectModel(Inventory.name) private readonly inventoryModel: Model<Inventory>,
        @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
        @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
    ) { }

    async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
        // If outstanding is missing, default to grandTotal
        if (createInvoiceDto.outstandingAmount === undefined) {
            createInvoiceDto.outstandingAmount = createInvoiceDto.grandTotal;
        }

        // Automatically flag status if paidAmount equals grandTotal initially
        const paidAmount = createInvoiceDto.paidAmount || 0;

        if (paidAmount === createInvoiceDto.grandTotal) {
            createInvoiceDto.status = 'PAID';
            createInvoiceDto.outstandingAmount = 0;
        } else if (paidAmount > 0) {
            createInvoiceDto.status = 'PARTIAL';
            createInvoiceDto.outstandingAmount = createInvoiceDto.grandTotal - paidAmount;
        }

        // Auto-generate a sequential InvoiceNumber if missing
        if (!createInvoiceDto.invoiceNumber) {
            createInvoiceDto.invoiceNumber = await this.getNextInvoiceNumber(createInvoiceDto.company as string);
        }

        const existing = await this.invoiceModel.findOne({ invoiceNumber: createInvoiceDto.invoiceNumber }).exec();
        if (existing) {
            throw new ConflictException(`Invoice number ${createInvoiceDto.invoiceNumber} is already generated.`);
        }

        const createdInvoice = new this.invoiceModel(createInvoiceDto);
        const savedInvoice = await createdInvoice.save();

        // 1. Mark selected inventories as SOLD
        if (createInvoiceDto.items && createInvoiceDto.items.length > 0) {
            for (const item of createInvoiceDto.items) {
                if (item.inventory) {
                    await this.inventoryModel.findByIdAndUpdate(item.inventory, { status: 'SOLD' }).exec();
                }
            }
        }

        // 2. Create pending payment entry
        if (savedInvoice.outstandingAmount > 0) {
            const pendingPayment = new this.paymentModel({
                invoice: savedInvoice._id,
                customer: savedInvoice.customer,
                company: savedInvoice.company,
                amount: savedInvoice.outstandingAmount,
                paymentMethod: 'OTHER', // Default placeholder 
                paymentDate: new Date(),
                status: 'PENDING',
                notes: 'Auto-generated invoice payment entry',
            });
            await pendingPayment.save();
        }

        return savedInvoice;
    }

    async getNextInvoiceNumber(companyId: string): Promise<string> {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-indexed (0 = Jan, 3 = Apr)

        let startYear, endYear;
        // Financial year starts April 1st
        if (month >= 3) {
            startYear = year;
            endYear = year + 1;
        } else {
            startYear = year - 1;
            endYear = year;
        }

        const fy = `${startYear}-${endYear}`;

        const invoices = await this.invoiceModel.find({
            company: companyId,
            invoiceNumber: new RegExp(`\\/${fy}$`)
        }).exec();

        let maxSeq = 0;
        for (const inv of invoices) {
            const match = inv.invoiceNumber.match(/^(\d+)\//);
            if (match) {
                const seq = parseInt(match[1], 10);
                if (seq > maxSeq) {
                    maxSeq = seq;
                }
            }
        }

        const nextSeq = maxSeq + 1;
        return `${nextSeq.toString().padStart(2, '0')}/${fy}`;
    }

    async findAll(
        companyId?: string,
        page: number = 1,
        limit: number = 10,
        search?: string,
        status?: string,
        startDate?: string,
        endDate?: string
    ) {
        let filter: any = companyId ? { company: companyId } : {};

        // 1. Specific status filter
        if (status) {
            filter.status = status;
        }

        // 2. Date range filter
        if (startDate || endDate) {
            filter.issueDate = {};
            if (startDate) {
                filter.issueDate.$gte = new Date(startDate);
            }
            if (endDate) {
                filter.issueDate.$lte = new Date(endDate);
            }
        }

        // 3. Search query
        if (search) {
            // Searching by Customer Name first to get matching customer IDs
            const matchingCustomers = await this.customerModel.find({
                name: { $regex: search, $options: 'i' },
                ...(companyId ? { company: companyId } : {})
            }).select('_id').exec();
            
            const customerIds = matchingCustomers.map(c => c._id);

            filter.$or = [
                { invoiceNumber: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } },
                { customer: { $in: customerIds } }
            ];
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.invoiceModel
                .find(filter)
                .sort({ issueDate: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate({ path: 'customer', model: 'Customer' })
                .populate({ path: 'company', model: 'Company' })
                .populate({ path: 'items.product', model: 'Product' })
                .populate({ path: 'items.inventory', model: 'Inventory' })
                .exec(),
            this.invoiceModel.countDocuments(filter).exec()
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findOne(id: string): Promise<Invoice> {
        const invoice = await this.invoiceModel
            .findById(id)
            .populate({ path: 'customer', model: 'Customer' })
            .populate({ path: 'company', model: 'Company' })
            .populate({ path: 'items.product', model: 'Product' })
            .populate({ path: 'items.inventory', model: 'Inventory' })
            .exec();
        if (!invoice) {
            throw new NotFoundException(`Invoice with ID "${id}" not found`);
        }
        return invoice;
    }

    async update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
        const existingInvoice = await this.invoiceModel.findById(id).exec();
        if (!existingInvoice) {
            throw new NotFoundException(`Invoice with ID "${id}" not found`);
        }

        if (updateInvoiceDto.invoiceNumber && updateInvoiceDto.invoiceNumber !== existingInvoice.invoiceNumber) {
            const duplicate = await this.invoiceModel.findOne({ invoiceNumber: updateInvoiceDto.invoiceNumber }).exec();
            if (duplicate) {
                throw new ConflictException(`Invoice number ${updateInvoiceDto.invoiceNumber} is already generated.`);
            }
        }

        // Always recalculate amounts if either changes
        if (updateInvoiceDto.grandTotal !== undefined || updateInvoiceDto.paidAmount !== undefined || updateInvoiceDto.items !== undefined) {
            const grandTotal = updateInvoiceDto.grandTotal !== undefined ? updateInvoiceDto.grandTotal : existingInvoice.grandTotal;
            const paidAmount = updateInvoiceDto.paidAmount !== undefined ? updateInvoiceDto.paidAmount : (existingInvoice.paidAmount || 0);
            const outstandingAmount = grandTotal - paidAmount;

            updateInvoiceDto.outstandingAmount = outstandingAmount > 0 ? outstandingAmount : 0;

            if (outstandingAmount <= 0) {
                updateInvoiceDto.status = 'PAID';
            } else if (paidAmount > 0) {
                updateInvoiceDto.status = 'PARTIAL';
            } else {
                updateInvoiceDto.status = 'UNPAID';
            }
        }

        const updatedInvoice = await this.invoiceModel
            .findByIdAndUpdate(id, updateInvoiceDto, { new: true })
            .exec();

        if (!updatedInvoice) {
            throw new NotFoundException(`Invoice with ID "${id}" not found`);
        }

        // Sync pending payment to reflect new outstanding balance properly
        const pendingPayment = await this.paymentModel.findOne({
            invoice: updatedInvoice._id,
            status: 'PENDING'
        });

        if (updatedInvoice.outstandingAmount > 0) {
            if (pendingPayment) {
                pendingPayment.amount = updatedInvoice.outstandingAmount;
                await pendingPayment.save();
            } else {
                const newPending = new this.paymentModel({
                    invoice: updatedInvoice._id,
                    customer: updatedInvoice.customer,
                    company: updatedInvoice.company,
                    amount: updatedInvoice.outstandingAmount,
                    paymentDate: new Date(),
                    paymentMethod: 'OTHER',
                    status: 'PENDING',
                    notes: 'Auto-updated pending balance due'
                });
                await newPending.save();
            }
        } else if (pendingPayment) {
            await this.paymentModel.findByIdAndDelete(pendingPayment._id);
        }

        return updatedInvoice;
    }

    async remove(id: string): Promise<Invoice> {
        const deletedInvoice = await this.invoiceModel.findByIdAndDelete(id).exec();
        if (!deletedInvoice) {
            throw new NotFoundException(`Invoice with ID "${id}" not found`);
        }
        return deletedInvoice;
    }
}
