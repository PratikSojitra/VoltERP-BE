import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Company } from '../../company/schemas/company.schema';
import { Customer } from '../../customer/schemas/customer.schema';

@Schema({ timestamps: true })
export class Payment extends Document {
    // We'll link this to Invoice once the Invoice schema is created
    @Prop({ type: Types.ObjectId, ref: 'Invoice', required: true })
    invoice: Types.ObjectId | any;

    @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
    customer: Types.ObjectId | Customer;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, default: Date.now })
    paymentDate: Date;

    @Prop({
        required: true,
        enum: ['CASH', 'BANK_TRANSFER', 'UPI', 'CHEQUE', 'CREDIT_CARD', 'OTHER'],
    })
    paymentMethod: string;

    @Prop({
        required: true,
        enum: ['PENDING', 'COMPLETED', 'FAILED', 'PARTIAL', 'REFUNDED'],
        default: 'COMPLETED',
    })
    status: string;

    @Prop()
    referenceNumber: string; // Tnx ID, Cheque No, etc.

    @Prop()
    notes: string;

    @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
    company: Types.ObjectId | Company;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
