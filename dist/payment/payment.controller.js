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
exports.PaymentController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const company_schema_1 = require("../company/schemas/company.schema");
const payment_service_1 = require("./payment.service");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const update_payment_dto_1 = require("./dto/update-payment.dto");
let PaymentController = class PaymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    create(createPaymentDto, req) {
        if (req.user.role === company_schema_1.Role.COMPANY) {
            createPaymentDto.company = req.user.userId;
        }
        else if (!createPaymentDto.company) {
            throw new common_1.ForbiddenException('Admin must provide a company ID to record a payment.');
        }
        return this.paymentService.create(createPaymentDto);
    }
    findAll(req, page, limit) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 10;
        if (req.user.role === company_schema_1.Role.COMPANY) {
            return this.paymentService.findAll(req.user.userId, pageNumber, limitNumber);
        }
        return this.paymentService.findAll(undefined, pageNumber, limitNumber);
    }
    async findOne(id, req) {
        const payment = await this.paymentService.findOne(id);
        const paymentCompanyId = payment.company._id ? payment.company._id.toString() : payment.company.toString();
        if (req.user.role === company_schema_1.Role.COMPANY && paymentCompanyId !== req.user.userId) {
            throw new common_1.ForbiddenException('You can only access your own payments');
        }
        return payment;
    }
    async update(id, updatePaymentDto, req) {
        const payment = await this.paymentService.findOne(id);
        const paymentCompanyId = payment.company._id ? payment.company._id.toString() : payment.company.toString();
        if (req.user.role === company_schema_1.Role.COMPANY && paymentCompanyId !== req.user.userId) {
            throw new common_1.ForbiddenException('You can only update your own payments');
        }
        return this.paymentService.update(id, updatePaymentDto);
    }
    async remove(id, req) {
        const payment = await this.paymentService.findOne(id);
        const paymentCompanyId = payment.company._id ? payment.company._id.toString() : payment.company.toString();
        if (req.user.role === company_schema_1.Role.COMPANY && paymentCompanyId !== req.user.userId) {
            throw new common_1.ForbiddenException('You can only delete your own payments');
        }
        return this.paymentService.remove(id);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 201, type: require("./schemas/payment.schema").Payment }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto, Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200, type: require("./schemas/payment.schema").Payment }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200, type: require("./schemas/payment.schema").Payment }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_payment_dto_1.UpdatePaymentDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200, type: require("./schemas/payment.schema").Payment }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "remove", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map