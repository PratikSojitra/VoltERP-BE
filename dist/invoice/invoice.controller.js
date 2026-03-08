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
exports.InvoiceController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const company_schema_1 = require("../company/schemas/company.schema");
const invoice_service_1 = require("./invoice.service");
const create_invoice_dto_1 = require("./dto/create-invoice.dto");
const update_invoice_dto_1 = require("./dto/update-invoice.dto");
let InvoiceController = class InvoiceController {
    invoiceService;
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    create(createInvoiceDto, req) {
        if (req.user.role === company_schema_1.Role.COMPANY) {
            createInvoiceDto.company = req.user.userId;
        }
        else if (!createInvoiceDto.company) {
            throw new common_1.ForbiddenException('Admin must provide a company ID to create an invoice.');
        }
        return this.invoiceService.create(createInvoiceDto);
    }
    findAll(req, page, limit) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 10;
        if (req.user.role === company_schema_1.Role.COMPANY) {
            return this.invoiceService.findAll(req.user.userId, pageNumber, limitNumber);
        }
        return this.invoiceService.findAll(undefined, pageNumber, limitNumber);
    }
    async getNextNumber(req, companyIdQuery) {
        let companyId = req.user.role === company_schema_1.Role.COMPANY ? req.user.userId : (companyIdQuery || req.user.userId);
        if (!companyId) {
            throw new common_1.ForbiddenException('Company ID is required to generate next invoice number.');
        }
        const nextNumber = await this.invoiceService.getNextInvoiceNumber(companyId);
        return { invoiceNumber: nextNumber };
    }
    async findOne(id, req) {
        const invoice = await this.invoiceService.findOne(id);
        const invoiceCompanyId = invoice.company._id ? invoice.company._id.toString() : invoice.company.toString();
        if (req.user.role === company_schema_1.Role.COMPANY && invoiceCompanyId !== req.user.userId) {
            throw new common_1.ForbiddenException('You can only access your own invoices');
        }
        return invoice;
    }
    async update(id, updateInvoiceDto, req) {
        const invoice = await this.invoiceService.findOne(id);
        const invoiceCompanyId = invoice.company._id ? invoice.company._id.toString() : invoice.company.toString();
        if (req.user.role === company_schema_1.Role.COMPANY && invoiceCompanyId !== req.user.userId) {
            throw new common_1.ForbiddenException('You can only update your own invoices');
        }
        return this.invoiceService.update(id, updateInvoiceDto);
    }
    async remove(id, req) {
        const invoice = await this.invoiceService.findOne(id);
        const invoiceCompanyId = invoice.company._id ? invoice.company._id.toString() : invoice.company.toString();
        if (req.user.role === company_schema_1.Role.COMPANY && invoiceCompanyId !== req.user.userId) {
            throw new common_1.ForbiddenException('You can only delete your own invoices');
        }
        return this.invoiceService.remove(id);
    }
};
exports.InvoiceController = InvoiceController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 201, type: require("./schemas/invoice.schema").Invoice }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_invoice_dto_1.CreateInvoiceDto, Object]),
    __metadata("design:returntype", void 0)
], InvoiceController.prototype, "create", null);
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
], InvoiceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('next-number'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('companyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "getNextNumber", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200, type: require("./schemas/invoice.schema").Invoice }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200, type: require("./schemas/invoice.schema").Invoice }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_invoice_dto_1.UpdateInvoiceDto, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200, type: require("./schemas/invoice.schema").Invoice }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "remove", null);
exports.InvoiceController = InvoiceController = __decorate([
    (0, common_1.Controller)('invoice'),
    __metadata("design:paramtypes", [invoice_service_1.InvoiceService])
], InvoiceController);
//# sourceMappingURL=invoice.controller.js.map