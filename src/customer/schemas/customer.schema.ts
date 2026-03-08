import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Company } from '../../company/schemas/company.schema';

export class CustomerAddress {
    @Prop()
    street: string;

    @Prop()
    city: string;

    @Prop()
    state: string;

    @Prop()
    stateCode: string;

    @Prop()
    zipCode: string;

    @Prop()
    country: string;
}

@Schema({ timestamps: true })
export class Customer extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ type: CustomerAddress })
    address: CustomerAddress;

    @Prop()
    gstNumber: string;

    @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
    company: Types.ObjectId | Company;

    @Prop({ default: true })
    isActive: boolean;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
