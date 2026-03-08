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
exports.CreateInvoiceDto = exports.InvoiceItemDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class InvoiceItemDto {
    product;
    inventory;
    quantity;
    unitPrice;
    gstRate;
    totalPrice;
    static _OPENAPI_METADATA_FACTORY() {
        return { product: { required: true, type: () => String }, inventory: { required: false, type: () => String }, quantity: { required: true, type: () => Number }, unitPrice: { required: true, type: () => Number }, gstRate: { required: false, type: () => Number }, totalPrice: { required: true, type: () => Number } };
    }
}
exports.InvoiceItemDto = InvoiceItemDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], InvoiceItemDto.prototype, "product", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], InvoiceItemDto.prototype, "inventory", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], InvoiceItemDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], InvoiceItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], InvoiceItemDto.prototype, "gstRate", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], InvoiceItemDto.prototype, "totalPrice", void 0);
class CreateInvoiceDto {
    invoiceNumber;
    customer;
    items;
    subTotal;
    totalTax;
    grandTotal;
    paidAmount;
    outstandingAmount;
    status;
    issueDate;
    dueDate;
    company;
    placeOfSupply;
    reverseCharge;
    notes;
    bankDetails;
    termsAndConditions;
    static _OPENAPI_METADATA_FACTORY() {
        return { invoiceNumber: { required: false, type: () => String }, customer: { required: true, type: () => String }, items: { required: true, type: () => [require("./create-invoice.dto").InvoiceItemDto] }, subTotal: { required: true, type: () => Number }, totalTax: { required: true, type: () => Number }, grandTotal: { required: true, type: () => Number }, paidAmount: { required: false, type: () => Number }, outstandingAmount: { required: false, type: () => Number }, status: { required: false, type: () => String }, issueDate: { required: false, type: () => String }, dueDate: { required: false, type: () => String }, company: { required: false, type: () => String }, placeOfSupply: { required: false, type: () => String }, reverseCharge: { required: false, type: () => Boolean }, notes: { required: false, type: () => String }, bankDetails: { required: false, type: () => String }, termsAndConditions: { required: false, type: () => String } };
    }
}
exports.CreateInvoiceDto = CreateInvoiceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "invoiceNumber", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "customer", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => InvoiceItemDto),
    __metadata("design:type", Array)
], CreateInvoiceDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "subTotal", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "totalTax", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "grandTotal", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "paidAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "outstandingAmount", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['UNPAID', 'PARTIAL', 'PAID', 'CANCELLED']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "issueDate", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "dueDate", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "company", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "placeOfSupply", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateInvoiceDto.prototype, "reverseCharge", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "bankDetails", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "termsAndConditions", void 0);
//# sourceMappingURL=create-invoice.dto.js.map