import { IsNumber, IsString, IsOptional, IsMongoId, IsEnum, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePaymentDto {
    @IsOptional()
    @IsMongoId()
    @Transform(({ value }) => value === '' ? undefined : value)
    invoice?: string;

    @IsOptional()
    @IsMongoId()
    @Transform(({ value }) => value === '' ? undefined : value)
    purchase?: string;

    @IsOptional()
    @IsMongoId()
    @Transform(({ value }) => value === '' ? undefined : value)
    customer?: string;

    @IsOptional()
    @IsMongoId()
    @Transform(({ value }) => value === '' ? undefined : value)
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
