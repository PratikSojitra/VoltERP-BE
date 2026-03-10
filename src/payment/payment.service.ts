import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment } from './schemas/payment.schema';
import { Invoice } from '../invoice/schemas/invoice.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
        @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
    ) { }

    private async syncInvoice(invoiceId: string | Types.ObjectId) {
        // Compute total paid for this invoice from COMPLETED / PARTIAL payments
        const payments = await this.paymentModel.find({
            invoice: invoiceId,
            status: { $in: ['COMPLETED', 'PARTIAL'] }
        });

        const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
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

        const pendingPayment = await this.paymentModel.findOne({
            invoice: invoiceId,
            status: 'PENDING'
        });

        if (outstandingAmount > 0) {
            if (pendingPayment) {
                // Adjust existing pending to reflect exact new balance
                pendingPayment.amount = outstandingAmount;
                await pendingPayment.save();
            } else {
                // If it doesn't exist but we still owe balance, clone pending payment
                const newPending = new this.paymentModel({
                    invoice: invoice._id,
                    customer: invoice.customer,
                    company: invoice.company,
                    amount: outstandingAmount,
                    paymentDate: new Date(),
                    paymentMethod: 'OTHER',
                    status: 'PENDING',
                    notes: 'Auto-updated pending balance due'
                });
                await newPending.save();
            }
        } else if (pendingPayment) {
            // Drop any pending payments if they've fully paid
            await this.paymentModel.findByIdAndDelete(pendingPayment._id);
        }
    }

    async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
        const createdPayment = new this.paymentModel(createPaymentDto);
        const saved = await createdPayment.save();
        await this.syncInvoice(saved.invoice);
        return saved;
    }

    async findAll(companyId?: string, page: number = 1, limit: number = 10) {
        const filter = companyId ? { company: companyId } : {};
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.paymentModel
                .find(filter)
                .skip(skip)
                .limit(limit)
                .populate('customer')
                .populate('company')
                .exec(),
            this.paymentModel.countDocuments(filter).exec()
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findOne(id: string): Promise<Payment> {
        const payment = await this.paymentModel
            .findById(id)
            .populate('customer')
            .populate('company')
            .exec();
        if (!payment) {
            throw new NotFoundException(`Payment record with ID "${id}" not found`);
        }
        return payment;
    }

    async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
        const existingPayment = await this.paymentModel
            .findByIdAndUpdate(id, updatePaymentDto, { new: true })
            .exec();

        if (!existingPayment) {
            throw new NotFoundException(`Payment record with ID "${id}" not found`);
        }
        await this.syncInvoice(existingPayment.invoice);
        return existingPayment;
    }

    async remove(id: string): Promise<Payment> {
        const deletedPayment = await this.paymentModel.findByIdAndDelete(id).exec();
        if (!deletedPayment) {
            throw new NotFoundException(`Payment record with ID "${id}" not found`);
        }
        await this.syncInvoice(deletedPayment.invoice);
        return deletedPayment;
    }
}
