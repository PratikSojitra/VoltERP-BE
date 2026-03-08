import { IsString, IsNumber, IsOptional, ValidateNested, IsArray, IsDateString, IsMongoId, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class InvoiceItemDto {
    @IsMongoId()
    product: string;

    @IsMongoId()
    @IsOptional()
    inventory?: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    unitPrice: number;

    @IsNumber()
    @IsOptional()
    gstRate?: number;

    @IsNumber()
    totalPrice: number;
}

export class CreateInvoiceDto {
    @IsString()
    @IsOptional()
    invoiceNumber?: string;

    @IsMongoId()
    customer: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InvoiceItemDto)
    items: InvoiceItemDto[];

    @IsNumber()
    subTotal: number;

    @IsNumber()
    totalTax: number;

    @IsNumber()
    grandTotal: number;

    @IsNumber()
    @IsOptional()
    paidAmount?: number;

    @IsNumber()
    @IsOptional()
    outstandingAmount?: number;

    @IsEnum(['UNPAID', 'PARTIAL', 'PAID', 'CANCELLED'])
    @IsOptional()
    status?: string;

    @IsDateString()
    @IsOptional()
    issueDate?: string;

    @IsDateString()
    @IsOptional()
    dueDate?: string;

    @IsMongoId()
    @IsOptional()
    company?: string;

    @IsString()
    @IsOptional()
    placeOfSupply?: string;

    @IsBoolean()
    @IsOptional()
    reverseCharge?: boolean;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsString()
    @IsOptional()
    bankDetails?: string;

    @IsString()
    @IsOptional()
    termsAndConditions?: string;
}
