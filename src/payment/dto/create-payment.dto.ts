import { IsNumber, IsString, IsOptional, IsMongoId, IsEnum, IsDateString } from 'class-validator';

export class CreatePaymentDto {
    @IsMongoId()
    invoice: string;

    @IsMongoId()
    customer: string;

    @IsNumber()
    amount: number;

    @IsDateString()
    @IsOptional()
    paymentDate?: string; // Stored as ISO/Date string

    @IsEnum(['CASH', 'BANK_TRANSFER', 'UPI', 'CHEQUE', 'CREDIT_CARD', 'OTHER'])
    paymentMethod: string;

    @IsEnum(['PENDING', 'COMPLETED', 'FAILED', 'PARTIAL', 'REFUNDED'])
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    referenceNumber?: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsMongoId()
    @IsOptional()
    company?: string;
}
