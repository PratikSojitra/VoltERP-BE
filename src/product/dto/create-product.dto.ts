import { IsString, IsNumber, IsOptional, IsBoolean, IsMongoId } from 'class-validator';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    type: string;

    @IsString()
    @IsOptional()
    hsnCode?: string;

    @IsNumber()
    @IsOptional()
    gstRate?: number;

    @IsNumber()
    basePrice: number;

    @IsMongoId()
    @IsOptional()
    company?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
