import { Document, Types } from 'mongoose';
import { Company } from '../../company/schemas/company.schema';
import { Customer } from '../../customer/schemas/customer.schema';
import { Product } from '../../product/schemas/product.schema';
export declare class InvoiceItem {
    product: Types.ObjectId | Product;
    inventory?: Types.ObjectId;
    quantity: number;
    unitPrice: number;
    gstRate: number;
    totalPrice: number;
}
export declare class Invoice extends Document {
    invoiceNumber: string;
    customer: Types.ObjectId | Customer;
    items: InvoiceItem[];
    subTotal: number;
    totalTax: number;
    grandTotal: number;
    paidAmount: number;
    outstandingAmount: number;
    status: string;
    issueDate: Date;
    dueDate: Date;
    company: Types.ObjectId | Company;
    placeOfSupply: string;
    reverseCharge: boolean;
    notes: string;
    bankDetails: string;
    termsAndConditions: string;
}
export declare const InvoiceSchema: import("mongoose").Schema<Invoice, import("mongoose").Model<Invoice, any, any, any, (Document<unknown, any, Invoice, any, import("mongoose").DefaultSchemaOptions> & Invoice & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Invoice, any, import("mongoose").DefaultSchemaOptions> & Invoice & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, Invoice>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Invoice, Document<unknown, {}, Invoice, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Invoice & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Invoice, Document<unknown, {}, Invoice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Invoice & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    invoiceNumber?: import("mongoose").SchemaDefinitionProperty<string, Invoice, Document<unknown, {}, Invoice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Invoice & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    customer?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | Customer, Invoice, Document<unknown, {}, Invoice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Invoice & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    items?: import("mongoose").SchemaDefinitionProperty<InvoiceItem[], Invoice, Document<unknown, {}, Invoice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Invoice & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    subTotal?: import("mongoose").SchemaDefinitionProperty<number, Invoice, Document<unknown, {}, Invoice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Invoice & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    totalTax?: import("mongoose").SchemaDefinitionProperty<number, Invoice, Document<unknown, {}, Invoice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Invoice & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    grandTotal?: import("mongoose").SchemaDefinitionProperty<number, Invoice, Document<unknown, {}, Invoice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Invoice & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    paidAmount?: import("mongoose").SchemaDefinitionProperty<number, Invoice, Document<unknown, {}, Invoice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Invoice & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    outstandingAmount?: import("mongoose").SchemaDefinitionProperty<number, Invoice, Document<unknown, {}, Invoice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Invoice & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Invoice, Document<unknown, {}, Invoice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Invoice & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    issueDate?: import("mongoose").SchemaDefinitionProperty<Date, Invoice, Document<unknown, {}, Invoice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Invoice & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dueDate?: import("mongoose").SchemaDefinitionProperty<Date, Invoice, Document<unknown, {}, Invoice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Invoice & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    company?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | Company, Invoice, Document<unknown, {}, Invoice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Invoice & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    placeOfSupply?: import("mongoose").SchemaDefinitionProperty<string, Invoice, Document<unknown, {}, Invoice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Invoice & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reverseCharge?: import("mongoose").SchemaDefinitionProperty<boolean, Invoice, Document<unknown, {}, Invoice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Invoice & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string, Invoice, Document<unknown, {}, Invoice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Invoice & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bankDetails?: import("mongoose").SchemaDefinitionProperty<string, Invoice, Document<unknown, {}, Invoice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Invoice & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    termsAndConditions?: import("mongoose").SchemaDefinitionProperty<string, Invoice, Document<unknown, {}, Invoice, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Invoice & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Invoice>;
