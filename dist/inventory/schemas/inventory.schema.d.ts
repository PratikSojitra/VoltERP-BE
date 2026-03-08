import { Document, Types } from 'mongoose';
import { Product } from '../../product/schemas/product.schema';
import { Company } from '../../company/schemas/company.schema';
export declare class Inventory extends Document {
    product: Types.ObjectId | Product;
    serialNumber: string;
    unitType: string;
    status: string;
    company: Types.ObjectId | Company;
}
export declare const InventorySchema: import("mongoose").Schema<Inventory, import("mongoose").Model<Inventory, any, any, any, (Document<unknown, any, Inventory, any, import("mongoose").DefaultSchemaOptions> & Inventory & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Inventory, any, import("mongoose").DefaultSchemaOptions> & Inventory & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, Inventory>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Inventory, Document<unknown, {}, Inventory, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    company?: import("mongoose").SchemaDefinitionProperty<Company | Types.ObjectId, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    product?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | Product, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    serialNumber?: import("mongoose").SchemaDefinitionProperty<string, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    unitType?: import("mongoose").SchemaDefinitionProperty<string, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Inventory, Document<unknown, {}, Inventory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Inventory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Inventory>;
