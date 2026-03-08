import { Model } from 'mongoose';
import { Inventory } from './schemas/inventory.schema';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
export declare class InventoryService {
    private readonly inventoryModel;
    constructor(inventoryModel: Model<Inventory>);
    create(createInventoryDto: CreateInventoryDto): Promise<Inventory>;
    findAll(companyId?: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, Inventory, {}, import("mongoose").DefaultSchemaOptions> & Inventory & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Inventory>;
    update(id: string, updateInventoryDto: UpdateInventoryDto): Promise<Inventory>;
    remove(id: string): Promise<Inventory>;
}
