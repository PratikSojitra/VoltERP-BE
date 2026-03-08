export declare class CustomerAddressDto {
    street?: string;
    city?: string;
    state?: string;
    stateCode?: string;
    zipCode?: string;
    country?: string;
}
export declare class CreateCustomerDto {
    name: string;
    email?: string;
    phone: string;
    address?: CustomerAddressDto;
    gstNumber?: string;
    company?: string;
    isActive?: boolean;
}
