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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateInventoryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateInventoryDto {
    product;
    serialNumber;
    unitType;
    status;
    company;
    static _OPENAPI_METADATA_FACTORY() {
        return { product: { required: true, type: () => String }, serialNumber: { required: true, type: () => String }, unitType: { required: true, type: () => String }, status: { required: false, type: () => String, enum: ['IN_STOCK', 'SOLD', 'DEFECTIVE'] }, company: { required: false, type: () => String } };
    }
}
exports.CreateInventoryDto = CreateInventoryDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "product", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "serialNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "unitType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['IN_STOCK', 'SOLD', 'DEFECTIVE']),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInventoryDto.prototype, "company", void 0);
//# sourceMappingURL=create-inventory.dto.js.map