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
exports.CustomerController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const company_schema_1 = require("../company/schemas/company.schema");
const customer_service_1 = require("./customer.service");
const create_customer_dto_1 = require("./dto/create-customer.dto");
const update_customer_dto_1 = require("./dto/update-customer.dto");
let CustomerController = class CustomerController {
    customerService;
    constructor(customerService) {
        this.customerService = customerService;
    }
    create(createCustomerDto, req) {
        if (req.user.role === company_schema_1.Role.COMPANY) {
            createCustomerDto.company = req.user.userId;
        }
        else if (!createCustomerDto.company) {
            throw new common_1.ForbiddenException('Admin must provide a company ID to create a customer.');
        }
        return this.customerService.create(createCustomerDto);
    }
    findAll(req, page, limit) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 10;
        if (req.user.role === company_schema_1.Role.COMPANY) {
            return this.customerService.findAll(req.user.userId, pageNumber, limitNumber);
        }
        return this.customerService.findAll(undefined, pageNumber, limitNumber);
    }
    async findOne(id, req) {
        const customer = await this.customerService.findOne(id);
        const customerCompanyId = customer.company._id ? customer.company._id.toString() : customer.company.toString();
        if (req.user.role === company_schema_1.Role.COMPANY && customerCompanyId !== req.user.userId) {
            throw new common_1.ForbiddenException('You can only access your own customers');
        }
        return customer;
    }
    async update(id, updateCustomerDto, req) {
        const customer = await this.customerService.findOne(id);
        const customerCompanyId = customer.company._id ? customer.company._id.toString() : customer.company.toString();
        if (req.user.role === company_schema_1.Role.COMPANY && customerCompanyId !== req.user.userId) {
            throw new common_1.ForbiddenException('You can only update your own customers');
        }
        return this.customerService.update(id, updateCustomerDto);
    }
    async remove(id, req) {
        const customer = await this.customerService.findOne(id);
        const customerCompanyId = customer.company._id ? customer.company._id.toString() : customer.company.toString();
        if (req.user.role === company_schema_1.Role.COMPANY && customerCompanyId !== req.user.userId) {
            throw new common_1.ForbiddenException('You can only delete your own customers');
        }
        return this.customerService.remove(id);
    }
};
exports.CustomerController = CustomerController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 201, type: require("./schemas/customer.schema").Customer }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_dto_1.CreateCustomerDto, Object]),
    __metadata("design:returntype", void 0)
], CustomerController.prototype, "create", null);
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
], CustomerController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200, type: require("./schemas/customer.schema").Customer }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200, type: require("./schemas/customer.schema").Customer }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_customer_dto_1.UpdateCustomerDto, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200, type: require("./schemas/customer.schema").Customer }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "remove", null);
exports.CustomerController = CustomerController = __decorate([
    (0, common_1.Controller)('customer'),
    __metadata("design:paramtypes", [customer_service_1.CustomerService])
], CustomerController);
//# sourceMappingURL=customer.controller.js.map