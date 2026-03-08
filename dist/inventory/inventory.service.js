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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const inventory_schema_1 = require("./schemas/inventory.schema");
let InventoryService = class InventoryService {
    inventoryModel;
    constructor(inventoryModel) {
        this.inventoryModel = inventoryModel;
    }
    async create(createInventoryDto) {
        const createdInventory = new this.inventoryModel(createInventoryDto);
        return createdInventory.save();
    }
    async findAll(companyId, page = 1, limit = 10) {
        const filter = companyId ? { company: companyId } : {};
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.inventoryModel.find(filter).skip(skip).limit(limit).populate('product').populate('company').exec(),
            this.inventoryModel.countDocuments(filter).exec()
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const inventory = await this.inventoryModel.findById(id).populate('product').populate('company').exec();
        if (!inventory) {
            throw new common_1.NotFoundException(`Inventory record with ID "${id}" not found`);
        }
        return inventory;
    }
    async update(id, updateInventoryDto) {
        const existingInventory = await this.inventoryModel
            .findByIdAndUpdate(id, updateInventoryDto, { new: true })
            .exec();
        if (!existingInventory) {
            throw new common_1.NotFoundException(`Inventory record with ID "${id}" not found`);
        }
        return existingInventory;
    }
    async remove(id) {
        const deletedInventory = await this.inventoryModel.findByIdAndDelete(id).exec();
        if (!deletedInventory) {
            throw new common_1.NotFoundException(`Inventory record with ID "${id}" not found`);
        }
        return deletedInventory;
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(inventory_schema_1.Inventory.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map