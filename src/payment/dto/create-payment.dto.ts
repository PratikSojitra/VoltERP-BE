import { IsNumber, IsString, IsOptional, IsMongoId, IsEnum, IsDateString } from 'class-validator';

export class CreatePaymentDto {
    @IsOptional()
    @IsMongoId()
    invoice?: string;

    @IsOptional()
    @IsMongoId()
    purchase?: string;

    @IsOptional()
    @IsMongoId()
    customer?: string;

    @IsOptional()
    @IsMongoId()
    vendor?: string;

    @IsOptional()
    @IsEnum(['SALES', 'PURCHASE'])
    type?: string;

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
