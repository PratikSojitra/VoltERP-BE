import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
import { Company } from '../../company/schemas/company.schema';
import { Customer } from '../../customer/schemas/customer.schema';
import { Product } from '../../product/schemas/product.schema';

export class InvoiceItem {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
    product: Types.ObjectId | Product;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' })
    inventory?: Types.ObjectId;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    unitPrice: number; // Price per item (e.g. from product basePrice)

    @Prop()
    gstRate: number; // e.g. 28

    @Prop({ required: true })
    totalPrice: number; // (Quantity * UnitPrice) + Tax
}

@Schema({ timestamps: true })
export class Invoice extends Document {
    @Prop({ required: true, unique: true })
    invoiceNumber: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true })
    customer: Types.ObjectId | Customer;

    @Prop({ type: [InvoiceItem], required: true })
    items: InvoiceItem[];

    @Prop({ required: true })
    subTotal: number;

    @Prop({ required: true })
    totalTax: number;

    @Prop({ required: true })
    grandTotal: number; // Final amount customer needs to pay

    @Prop({ default: 0 })
    paidAmount: number; // How much has been paid through the Payment module

    @Prop({ required: true })
    outstandingAmount: number; // Automatically calculated: grandTotal - paidAmount

    @Prop({
        required: true,
        enum: ['UNPAID', 'PARTIAL', 'PAID', 'CANCELLED'],
        default: 'UNPAID',
    })
    status: string;

    @Prop({ default: Date.now })
    issueDate: Date;

    @Prop()
    dueDate: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true })
    company: Types.ObjectId | Company;

    @Prop()
    placeOfSupply: string;

    @Prop({ default: false })
    reverseCharge: boolean;

    @Prop()
    notes: string;

    @Prop()
    bankDetails: string;

    @Prop()
    termsAndConditions: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
