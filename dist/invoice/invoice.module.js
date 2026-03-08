"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const invoice_controller_1 = require("./invoice.controller");
const invoice_service_1 = require("./invoice.service");
const invoice_schema_1 = require("./schemas/invoice.schema");
const inventory_schema_1 = require("../inventory/schemas/inventory.schema");
const payment_schema_1 = require("../payment/schemas/payment.schema");
let InvoiceModule = class InvoiceModule {
};
exports.InvoiceModule = InvoiceModule;
exports.InvoiceModule = InvoiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: invoice_schema_1.Invoice.name, schema: invoice_schema_1.InvoiceSchema },
                { name: inventory_schema_1.Inventory.name, schema: inventory_schema_1.InventorySchema },
                { name: payment_schema_1.Payment.name, schema: payment_schema_1.PaymentSchema },
            ])
        ],
        controllers: [invoice_controller_1.InvoiceController],
        providers: [invoice_service_1.InvoiceService],
        exports: [invoice_service_1.InvoiceService],
    })
], InvoiceModule);
//# sourceMappingURL=invoice.module.js.map