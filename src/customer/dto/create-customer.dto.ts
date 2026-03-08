import { IsString, IsEmail, IsOptional, ValidateNested, IsBoolean, IsMongoId, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class CustomerAddressDto {
    @IsString()
    @IsOptional()
    street?: string;

    @IsString()
    @IsOptional()
    city?: string;

    @IsString()
    @IsOptional()
    state?: string;

    @IsString()
    @IsOptional()
    stateCode?: string;

    @IsString()
    @IsOptional()
    zipCode?: string;

    @IsString()
    @IsOptional()
    country?: string;
}

export class CreateCustomerDto {
    @IsString()
    name: string;

    @IsEmail()
    @IsOptional()
    @ValidateIf((o) => o.email !== "" && o.email !== null)
    email?: string;

    @IsString()
    phone: string;

    @ValidateNested()
    @Type(() => CustomerAddressDto)
    @IsOptional()
    address?: CustomerAddressDto;

    @IsString()
    @IsOptional()
    gstNumber?: string;

    @IsMongoId()
    @IsOptional()
    company?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
