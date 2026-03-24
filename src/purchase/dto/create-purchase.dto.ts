import { IsString, IsNumber, IsMongoId, IsIn, IsOptional, ValidateNested, IsDateString, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class PurchaseItemDto {
    @IsMongoId()
    product: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    unitPrice: number;

    @IsNumber()
    @IsOptional()
    gstRate?: number;

    @IsNumber()
    @IsOptional()
    totalPrice?: number;

    @IsString()
    @IsOptional()
    unitType?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    serialNumbers?: string[];
}

export class CreatePurchaseDto {
    @IsString()
    @IsOptional()
    invoiceNumber?: string;

    @IsMongoId()
    vendor: string;

    @IsDateString()
    purchaseDate: string;

    @IsNumber()
    @IsOptional()
    totalAmount?: number;

    @IsNumber()
    @IsOptional()
    subTotal?: number;

    @IsNumber()
    @IsOptional()
    totalTax?: number;

    @IsNumber()
    @IsOptional()
    grandTotal?: number;

    @IsString()
    @IsOptional()
    @IsIn(['PENDING', 'COMPLETED', 'CANCELLED'])
    status?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PurchaseItemDto)
    items: PurchaseItemDto[];

    @IsMongoId()
    @IsOptional()
    company?: string;
}
