"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const invoice_schema_1 = require("./schemas/invoice.schema");
const inventory_schema_1 = require("../inventory/schemas/inventory.schema");
const payment_schema_1 = require("../payment/schemas/payment.schema");
let InvoiceService = class InvoiceService {
    invoiceModel;
    inventoryModel;
    paymentModel;
    constructor(invoiceModel, inventoryModel, paymentModel) {
        this.invoiceModel = invoiceModel;
        this.inventoryModel = inventoryModel;
        this.paymentModel = paymentModel;
    }
    async create(createInvoiceDto) {
        if (createInvoiceDto.outstandingAmount === undefined) {
            createInvoiceDto.outstandingAmount = createInvoiceDto.grandTotal;
        }
        const paidAmount = createInvoiceDto.paidAmount || 0;
        if (paidAmount === createInvoiceDto.grandTotal) {
            createInvoiceDto.status = 'PAID';
            createInvoiceDto.outstandingAmount = 0;
        }
        else if (paidAmount > 0) {
            createInvoiceDto.status = 'PARTIAL';
            createInvoiceDto.outstandingAmount = createInvoiceDto.grandTotal - paidAmount;
        }
        if (!createInvoiceDto.invoiceNumber) {
            createInvoiceDto.invoiceNumber = await this.getNextInvoiceNumber(createInvoiceDto.company);
        }
        const createdInvoice = new this.invoiceModel(createInvoiceDto);
        const savedInvoice = await createdInvoice.save();
        if (createInvoiceDto.items && createInvoiceDto.items.length > 0) {
            for (const item of createInvoiceDto.items) {
                if (item.inventory) {
                    await this.inventoryModel.findByIdAndUpdate(item.inventory, { status: 'SOLD' }).exec();
                }
            }
        }
        if (savedInvoice.outstandingAmount > 0) {
            const pendingPayment = new this.paymentModel({
                invoice: savedInvoice._id,
                customer: savedInvoice.customer,
                company: savedInvoice.company,
                amount: savedInvoice.outstandingAmount,
                paymentMethod: 'OTHER',
                paymentDate: new Date(),
                status: 'PENDING',
                notes: 'Auto-generated invoice payment entry',
            });
            await pendingPayment.save();
        }
        return savedInvoice;
    }
    async getNextInvoiceNumber(companyId) {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        let startYear, endYear;
        if (month >= 3) {
            startYear = year;
            endYear = year + 1;
        }
        else {
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
    async findAll(companyId, page = 1, limit = 10) {
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
    async findOne(id) {
        const invoice = await this.invoiceModel
            .findById(id)
            .populate('customer')
            .populate('company')
            .populate('items.product')
            .exec();
        if (!invoice) {
            throw new common_1.NotFoundException(`Invoice with ID "${id}" not found`);
        }
        return invoice;
    }
    async update(id, updateInvoiceDto) {
        const existingInvoice = await this.invoiceModel.findById(id).exec();
        if (!existingInvoice) {
            throw new common_1.NotFoundException(`Invoice with ID "${id}" not found`);
        }
        if (updateInvoiceDto.paidAmount !== undefined) {
            const grandTotal = updateInvoiceDto.grandTotal !== undefined ? updateInvoiceDto.grandTotal : existingInvoice.grandTotal;
            const outstandingAmount = grandTotal - updateInvoiceDto.paidAmount;
            updateInvoiceDto.outstandingAmount = outstandingAmount;
            if (outstandingAmount <= 0) {
                updateInvoiceDto.status = 'PAID';
            }
            else if (updateInvoiceDto.paidAmount > 0 && updateInvoiceDto.paidAmount < grandTotal) {
                updateInvoiceDto.status = 'PARTIAL';
            }
            else {
                updateInvoiceDto.status = 'UNPAID';
            }
        }
        const updatedInvoice = await this.invoiceModel
            .findByIdAndUpdate(id, updateInvoiceDto, { new: true })
            .exec();
        if (!updatedInvoice) {
            throw new common_1.NotFoundException(`Invoice with ID "${id}" not found`);
        }
        return updatedInvoice;
    }
    async remove(id) {
        const deletedInvoice = await this.invoiceModel.findByIdAndDelete(id).exec();
        if (!deletedInvoice) {
            throw new common_1.NotFoundException(`Invoice with ID "${id}" not found`);
        }
        return deletedInvoice;
    }
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(invoice_schema_1.Invoice.name)),
    __param(1, (0, mongoose_1.InjectModel)(inventory_schema_1.Inventory.name)),
    __param(2, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map