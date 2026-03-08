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
exports.InventoryController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const company_schema_1 = require("../company/schemas/company.schema");
const inventory_service_1 = require("./inventory.service");
const create_inventory_dto_1 = require("./dto/create-inventory.dto");
const update_inventory_dto_1 = require("./dto/update-inventory.dto");
let InventoryController = class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    create(createInventoryDto, req) {
        if (req.user.role === company_schema_1.Role.COMPANY) {
            createInventoryDto.company = req.user.userId;
        }
        else if (!createInventoryDto.company) {
            throw new common_1.ForbiddenException('Admin must provide a company ID to create an inventory record.');
        }
        return this.inventoryService.create(createInventoryDto);
    }
    findAll(req, page, limit) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 10;
        if (req.user.role === company_schema_1.Role.COMPANY) {
            return this.inventoryService.findAll(req.user.userId, pageNumber, limitNumber);
        }
        return this.inventoryService.findAll(undefined, pageNumber, limitNumber);
    }
    async findOne(id, req) {
        const inventory = await this.inventoryService.findOne(id);
        const inventoryCompanyId = inventory.company._id ? inventory.company._id.toString() : inventory.company.toString();
        if (req.user.role === company_schema_1.Role.COMPANY && inventoryCompanyId !== req.user.userId) {
            throw new common_1.ForbiddenException('You can only access your own inventory');
        }
        return inventory;
    }
    async update(id, updateInventoryDto, req) {
        const inventory = await this.inventoryService.findOne(id);
        const inventoryCompanyId = inventory.company._id ? inventory.company._id.toString() : inventory.company.toString();
        if (req.user.role === company_schema_1.Role.COMPANY && inventoryCompanyId !== req.user.userId) {
            throw new common_1.ForbiddenException('You can only update your own inventory');
        }
        return this.inventoryService.update(id, updateInventoryDto);
    }
    async remove(id, req) {
        const inventory = await this.inventoryService.findOne(id);
        const inventoryCompanyId = inventory.company._id ? inventory.company._id.toString() : inventory.company.toString();
        if (req.user.role === company_schema_1.Role.COMPANY && inventoryCompanyId !== req.user.userId) {
            throw new common_1.ForbiddenException('You can only delete your own inventory');
        }
        return this.inventoryService.remove(id);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 201, type: require("./schemas/inventory.schema").Inventory }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_dto_1.CreateInventoryDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "create", null);
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
], InventoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200, type: require("./schemas/inventory.schema").Inventory }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200, type: require("./schemas/inventory.schema").Inventory }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_inventory_dto_1.UpdateInventoryDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200, type: require("./schemas/inventory.schema").Inventory }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "remove", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map