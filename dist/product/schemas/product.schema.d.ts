import { Document, Types } from 'mongoose';
import { Company } from '../../company/schemas/company.schema';
export declare class Product extends Document {
    name: string;
    type: string;
    hsnCode: string;
    gstRate: number;
    basePrice: number;
    company: Types.ObjectId | Company;
    isActive: boolean;
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, (Document<unknown, any, Product, any, import("mongoose").DefaultSchemaOptions> & Product & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Product, any, import("mongoose").DefaultSchemaOptions> & Product & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, Product>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, Product, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Product & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Product & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<string, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Product & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Product & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Product & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    company?: import("mongoose").SchemaDefinitionProperty<Company | Types.ObjectId, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Product & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    hsnCode?: import("mongoose").SchemaDefinitionProperty<string, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Product & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    gstRate?: import("mongoose").SchemaDefinitionProperty<number, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Product & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    basePrice?: import("mongoose").SchemaDefinitionProperty<number, Product, Document<unknown, {}, Product, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Product & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Product>;
