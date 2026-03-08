import { Document, Types } from 'mongoose';
import { Company } from '../../company/schemas/company.schema';
export declare class CustomerAddress {
    street: string;
    city: string;
    state: string;
    stateCode: string;
    zipCode: string;
    country: string;
}
export declare class Customer extends Document {
    name: string;
    email: string;
    phone: string;
    address: CustomerAddress;
    gstNumber: string;
    company: Types.ObjectId | Company;
    isActive: boolean;
}
export declare const CustomerSchema: import("mongoose").Schema<Customer, import("mongoose").Model<Customer, any, any, any, (Document<unknown, any, Customer, any, import("mongoose").DefaultSchemaOptions> & Customer & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Customer, any, import("mongoose").DefaultSchemaOptions> & Customer & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, Customer>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Customer, Document<unknown, {}, Customer, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Customer & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<CustomerAddress, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    company?: import("mongoose").SchemaDefinitionProperty<Company | Types.ObjectId, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    gstNumber?: import("mongoose").SchemaDefinitionProperty<string, Customer, Document<unknown, {}, Customer, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Customer & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Customer>;
