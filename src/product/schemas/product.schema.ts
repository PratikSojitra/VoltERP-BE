import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Company } from '../../company/schemas/company.schema';

@Schema({ timestamps: true })
export class Product extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    type: string; // e.g. "AC_SPLIT"

    @Prop()
    hsnCode: string; // e.g. "8415"

    @Prop()
    gstRate: number; // e.g. 28

    @Prop({ required: true })
    basePrice: number;

    @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
    company: Types.ObjectId | Company;

    @Prop({ default: true })
    isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
