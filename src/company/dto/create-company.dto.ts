import { IsEmail, IsString, IsOptional, ValidateNested, IsBoolean, IsUrl, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
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

export class CreateCompanyDto {
    @IsString()
    name: string;

    @IsString()
    password?: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @ValidateNested()
    @Type(() => AddressDto)
    @IsOptional()
    address?: AddressDto;

    @IsString()
    @IsOptional()
    industry?: string;

    @IsString()
    @IsOptional()
    website?: string;

    @IsUrl()
    @IsOptional()
    @ValidateIf((o) => o.logoUrl !== "" && o.logoUrl !== null)
    logoUrl?: string;

    @IsString()
    @IsOptional()
    registrationNumber?: string;

    @IsString()
    @IsOptional()
    taxId?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsString()
    @IsOptional()
    bankDetails?: string;

    @IsString()
    @IsOptional()
    termsAndConditions?: string;
}
