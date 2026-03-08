import { IsString, IsMongoId, IsIn, IsOptional } from 'class-validator';

export class CreateInventoryDto {
    @IsMongoId()
    product: string;

    @IsString()
    serialNumber: string;

    @IsString()
    unitType: string;

    @IsString()
    @IsOptional()
    @IsIn(['IN_STOCK', 'SOLD', 'DEFECTIVE'])
    status?: string;

    @IsMongoId()
    @IsOptional()
    company?: string;
}
