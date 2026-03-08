export declare class AddressDto {
    street?: string;
    city?: string;
    state?: string;
    stateCode?: string;
    zipCode?: string;
    country?: string;
}
export declare class CreateCompanyDto {
    name: string;
    password?: string;
    email: string;
    phone?: string;
    address?: AddressDto;
    industry?: string;
    website?: string;
    logoUrl?: string;
    registrationNumber?: string;
    taxId?: string;
    isActive?: boolean;
    bankDetails?: string;
    termsAndConditions?: string;
}
