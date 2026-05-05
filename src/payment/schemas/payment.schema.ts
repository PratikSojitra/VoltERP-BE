import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document, Types } from 'mongoose';
import { Company } from '../../company/schemas/company.schema';
import { Customer } from '../../customer/schemas/customer.schema';

@Schema({ timestamps: true })
export class Payment extends Document {
    // We'll link this to Invoice once the Invoice schema is created
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: false })
    invoice: Types.ObjectId | any;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Purchase', required: false })
    purchase: Types.ObjectId | any;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: false })
    customer: Types.ObjectId | Customer;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: false })
    vendor: Types.ObjectId | any;

    @Prop({ required: true, enum: ['SALES', 'PURCHASE'], default: 'SALES' })
    type: string;

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

    @Prop([{
        amount: { type: Number, required: true },
        paymentDate: { type: Date, required: true },
        paymentMethod: { type: String, required: true },
        referenceNumber: { type: String },
        notes: { type: String },
        createdAt: { type: Date, default: Date.now }
    }])
    history: any[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true })
    company: Types.ObjectId | Company;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
