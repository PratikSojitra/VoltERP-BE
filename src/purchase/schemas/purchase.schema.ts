import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Company } from '../../company/schemas/company.schema';
import { Vendor } from '../../vendor/schemas/vendor.schema';
import { Product } from '../../product/schemas/product.schema';

@Schema()
export class PurchaseItem {
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    product: Types.ObjectId | Product;

    @Prop({ required: true })
    quantity: number;

    @Prop({ required: true })
    unitPrice: number;

    @Prop({ required: true, default: 0 })
    gstRate: number;

    @Prop({ required: true, default: 0 })
    totalPrice: number;

    @Prop({ type: [String], default: [] })
    serialNumbers: string[];

    @Prop({ type: String, default: "Standard Unit" })
    unitType: string;
}

export const PurchaseItemSchema = SchemaFactory.createForClass(PurchaseItem);

@Schema({ timestamps: true })
export class Purchase extends Document {
    @Prop({ required: true, unique: true })
    invoiceNumber: string;

    @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
    vendor: Types.ObjectId | Vendor;

    @Prop({ required: true })
    purchaseDate: Date;

    @Prop({ default: 0 })
    subTotal: number;

    @Prop({ default: 0 })
    totalTax: number;

    @Prop({ default: 0 })
    totalAmount: number;

    @Prop({ default: 0 })
    grandTotal: number;

    @Prop({ required: true, default: 'COMPLETED', enum: ['PENDING', 'COMPLETED', 'CANCELLED'] })
    status: string;

    @Prop({ type: [PurchaseItemSchema], default: [] })
    items: PurchaseItem[];

    @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
    company: Types.ObjectId | Company;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
