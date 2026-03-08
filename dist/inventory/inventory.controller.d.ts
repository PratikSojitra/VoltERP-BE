import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    create(createInventoryDto: CreateInventoryDto, req: any): Promise<import("./schemas/inventory.schema").Inventory>;
    findAll(req: any, page?: string, limit?: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/inventory.schema").Inventory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/inventory.schema").Inventory & Required<{
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
    findOne(id: string, req: any): Promise<import("./schemas/inventory.schema").Inventory>;
    update(id: string, updateInventoryDto: UpdateInventoryDto, req: any): Promise<import("./schemas/inventory.schema").Inventory>;
    remove(id: string, req: any): Promise<import("./schemas/inventory.schema").Inventory>;
}
