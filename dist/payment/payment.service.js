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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const payment_schema_1 = require("./schemas/payment.schema");
let PaymentService = class PaymentService {
    paymentModel;
    constructor(paymentModel) {
        this.paymentModel = paymentModel;
    }
    async create(createPaymentDto) {
        const createdPayment = new this.paymentModel(createPaymentDto);
        return createdPayment.save();
    }
    async findAll(companyId, page = 1, limit = 10) {
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
    async findOne(id) {
        const payment = await this.paymentModel
            .findById(id)
            .populate('customer')
            .populate('company')
            .exec();
        if (!payment) {
            throw new common_1.NotFoundException(`Payment record with ID "${id}" not found`);
        }
        return payment;
    }
    async update(id, updatePaymentDto) {
        const existingPayment = await this.paymentModel
            .findByIdAndUpdate(id, updatePaymentDto, { new: true })
            .exec();
        if (!existingPayment) {
            throw new common_1.NotFoundException(`Payment record with ID "${id}" not found`);
        }
        return existingPayment;
    }
    async remove(id) {
        const deletedPayment = await this.paymentModel.findByIdAndDelete(id).exec();
        if (!deletedPayment) {
            throw new common_1.NotFoundException(`Payment record with ID "${id}" not found`);
        }
        return deletedPayment;
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PaymentService);
//# sourceMappingURL=payment.service.js.map