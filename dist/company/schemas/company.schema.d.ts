import { Document } from 'mongoose';
export declare class Address {
    street: string;
    city: string;
    state: string;
    stateCode: string;
    zipCode: string;
    country: string;
}
export declare enum Role {
    ADMIN = "ADMIN",
    COMPANY = "COMPANY"
}
export declare class Company extends Document {
    name: string;
    password?: string;
    role: Role;
    email: string;
    phone: string;
    address: Address;
    industry: string;
    website: string;
    logoUrl: string;
    registrationNumber: string;
    taxId: string;
    isActive: boolean;
    bankDetails: string;
    termsAndConditions: string;
}
export declare const CompanySchema: import("mongoose").Schema<Company, import("mongoose").Model<Company, any, any, any, (Document<unknown, any, Company, any, import("mongoose").DefaultSchemaOptions> & Company & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Company, any, import("mongoose").DefaultSchemaOptions> & Company & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}), any, Company>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Company, Document<unknown, {}, Company, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Company & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Company, Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Company, Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    password?: import("mongoose").SchemaDefinitionProperty<string | undefined, Company, Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    role?: import("mongoose").SchemaDefinitionProperty<Role, Company, Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, Company, Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Company, Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<Address, Company, Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    industry?: import("mongoose").SchemaDefinitionProperty<string, Company, Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    website?: import("mongoose").SchemaDefinitionProperty<string, Company, Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    logoUrl?: import("mongoose").SchemaDefinitionProperty<string, Company, Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    registrationNumber?: import("mongoose").SchemaDefinitionProperty<string, Company, Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    taxId?: import("mongoose").SchemaDefinitionProperty<string, Company, Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Company, Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bankDetails?: import("mongoose").SchemaDefinitionProperty<string, Company, Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    termsAndConditions?: import("mongoose").SchemaDefinitionProperty<string, Company, Document<unknown, {}, Company, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Company & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Company>;
