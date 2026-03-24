import { IsString, IsEmail, IsOptional, IsObject, IsMongoId } from 'class-validator';

export class CreateVendorDto {
    @IsString()
    name: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    phone: string;

    @IsString()
    @IsOptional()
    gstNumber?: string;

    @IsObject()
    @IsOptional()
    address?: {
        street?: string;
        city?: string;
        state?: string;
        stateCode?: string;
        zipCode?: string;
        country?: string;
    };

    @IsMongoId()
    @IsOptional()
    company?: string;
}
