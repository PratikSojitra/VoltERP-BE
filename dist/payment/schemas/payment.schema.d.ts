import { Document, Types } from 'mongoose';
import { Company } from '../../company/schemas/company.schema';
import { Customer } from '../../customer/schemas/customer.schema';
export declare class Payment extends Document {
    invoice: Types.ObjectId | any;
    customer: Types.ObjectId | Customer;
    amount: number;
    paymentDate: Date;
    paymentMethod: string;
    status: string;
    referenceNumber: string;
    notes: string;
    company: Types.ObjectId | Company;
}
export declare const PaymentSchema: import("mongoose").Schema<Payment, import("mongoose").Model<Payment, any, any, any, (Document<unknown, any, Payment, any, import("mongoose").DefaultSchemaOptions> & Payment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Payment, any, import("mongoose").DefaultSchemaOptions> & Payment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, Payment>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Payment, Document<unknown, {}, Payment, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Payment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    company?: import("mongoose").SchemaDefinitionProperty<Company | Types.ObjectId, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    customer?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | Customer, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    invoice?: import("mongoose").SchemaDefinitionProperty<any, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    paymentDate?: import("mongoose").SchemaDefinitionProperty<Date, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    paymentMethod?: import("mongoose").SchemaDefinitionProperty<string, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    referenceNumber?: import("mongoose").SchemaDefinitionProperty<string, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Payment>;
