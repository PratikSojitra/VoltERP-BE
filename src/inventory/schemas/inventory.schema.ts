import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Product } from '../../product/schemas/product.schema';
import { Company } from '../../company/schemas/company.schema';

@Schema({ timestamps: true })
export class Inventory extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    product: Types.ObjectId | Product;

    @Prop({ required: true })
    serialNumber: string;

    @Prop({ required: true })
    unitType: string; // e.g. "IDU" | "ODU"

    @Prop({ required: true, default: 'IN_STOCK', enum: ['IN_STOCK', 'SOLD', 'DEFECTIVE'] })
    status: string;

    @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
    company: Types.ObjectId | Company;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
