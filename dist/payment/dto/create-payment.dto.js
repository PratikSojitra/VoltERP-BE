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
exports.CreatePaymentDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePaymentDto {
    invoice;
    customer;
    amount;
    paymentDate;
    paymentMethod;
    status;
    referenceNumber;
    notes;
    company;
    static _OPENAPI_METADATA_FACTORY() {
        return { invoice: { required: true, type: () => String }, customer: { required: true, type: () => String }, amount: { required: true, type: () => Number }, paymentDate: { required: false, type: () => String }, paymentMethod: { required: true, type: () => String }, status: { required: false, type: () => String }, referenceNumber: { required: false, type: () => String }, notes: { required: false, type: () => String }, company: { required: false, type: () => String } };
    }
}
exports.CreatePaymentDto = CreatePaymentDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "invoice", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "customer", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "paymentDate", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['CASH', 'BANK_TRANSFER', 'UPI', 'CHEQUE', 'CREDIT_CARD', 'OTHER']),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['PENDING', 'COMPLETED', 'FAILED', 'PARTIAL', 'REFUNDED']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "referenceNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "company", void 0);
//# sourceMappingURL=create-payment.dto.js.map