import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Company } from '../../company/schemas/company.schema';

@Schema({ timestamps: true })
export class Vendor extends Document {
    @Prop({ required: true })
    name: string;

    @Prop()
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop()
    gstNumber: string;

    @Prop({ type: Object })
    address: {
        street?: string;
        city?: string;
        state?: string;
        stateCode?: string;
        zipCode?: string;
        country?: string;
    };

    @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
    company: Types.ObjectId | Company;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
