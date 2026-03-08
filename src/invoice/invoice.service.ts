import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Inventory } from '../inventory/schemas/inventory.schema';
import { Payment } from '../payment/schemas/payment.schema';

@Injectable()
export class InvoiceService {
    constructor(
        @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
        @InjectModel(Inventory.name) private readonly inventoryModel: Model<Inventory>,
        @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
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

    async findAll(companyId?: string, page: number = 1, limit: number = 10) {
        const filter = companyId ? { company: companyId } : {};
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.invoiceModel
                .find(filter)
                .skip(skip)
                .limit(limit)
                .populate('customer')
                .populate('company')
                .populate('items.product')
                .exec(),
            this.invoiceModel.countDocuments(filter).exec()
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findOne(id: string): Promise<Invoice> {
        const invoice = await this.invoiceModel
            .findById(id)
            .populate('customer')
            .populate('company')
            .populate('items.product')
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

        // Recalculate status and outstanding if they send a patch adjusting amounts
        if (updateInvoiceDto.paidAmount !== undefined) {
            const grandTotal = updateInvoiceDto.grandTotal !== undefined ? updateInvoiceDto.grandTotal : existingInvoice.grandTotal;
            const outstandingAmount = grandTotal - updateInvoiceDto.paidAmount;

            updateInvoiceDto.outstandingAmount = outstandingAmount;

            if (outstandingAmount <= 0) {
                updateInvoiceDto.status = 'PAID';
            } else if (updateInvoiceDto.paidAmount > 0 && updateInvoiceDto.paidAmount < grandTotal) {
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
