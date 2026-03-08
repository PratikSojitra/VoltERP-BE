import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class Address {
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

export enum Role {
    ADMIN = 'ADMIN',
    COMPANY = 'COMPANY',
}

@Schema({ timestamps: true })
export class Company extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    password?: string;

    @Prop({ type: String, enum: Role, default: Role.COMPANY })
    role: Role;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    phone: string;

    @Prop({ type: Address })
    address: Address;

    @Prop()
    industry: string;

    @Prop()
    website: string;

    @Prop()
    logoUrl: string;

    @Prop()
    registrationNumber: string;

    @Prop()
    taxId: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop()
    bankDetails: string;

    @Prop()
    termsAndConditions: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
