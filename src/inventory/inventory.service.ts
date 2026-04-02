import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Inventory } from './schemas/inventory.schema';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
    constructor(
        @InjectModel(Inventory.name) private readonly inventoryModel: Model<Inventory>,
    ) { }

    async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
        const createdInventory = new this.inventoryModel(createInventoryDto);
        return createdInventory.save();
    }

    async findAll(companyId?: string, page: number = 1, limit: number = 10, search?: string, status?: string) {
        let filter: any = companyId ? { company: companyId } : {};

        if (status) {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                { serialNumber: { $regex: search, $options: 'i' } }
            ];
            
            if (!status) {
                filter.$or.push({ status: { $regex: search, $options: 'i' } });
            }
        }
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.inventoryModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('product').populate('company').exec(),
            this.inventoryModel.countDocuments(filter).exec()
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findOne(id: string): Promise<Inventory> {
        const inventory = await this.inventoryModel.findById(id).populate('product').populate('company').exec();
        if (!inventory) {
            throw new NotFoundException(`Inventory record with ID "${id}" not found`);
        }
        return inventory;
    }

    async update(id: string, updateInventoryDto: UpdateInventoryDto): Promise<Inventory> {
        const existingInventory = await this.inventoryModel
            .findByIdAndUpdate(id, updateInventoryDto, { new: true })
            .exec();

        if (!existingInventory) {
            throw new NotFoundException(`Inventory record with ID "${id}" not found`);
        }
        return existingInventory;
    }

    async remove(id: string): Promise<Inventory> {
        const deletedInventory = await this.inventoryModel.findByIdAndDelete(id).exec();
        if (!deletedInventory) {
            throw new NotFoundException(`Inventory record with ID "${id}" not found`);
        }
        return deletedInventory;
    }
    async findGroupedByProduct(companyId?: string) {
        console.log('Grouping inventory for company:', companyId);
        
        // Fetch up to 5000 items (reasonable limit for grouping in JS)
        const inventory = await this.findAll(companyId, 1, 5000);
        const data = inventory.data || [];
        
        const groupedMap = new Map();
        
        data.forEach((item: any) => {
            const product = item.product;
            if (!product) return;
            
            const prodId = product._id?.toString() || product.toString();
            
            if (!groupedMap.has(prodId)) {
                groupedMap.set(prodId, {
                    product: product,
                    count: 0,
                    inStock: 0,
                    sold: 0,
                    defective: 0,
                    serialNumbers: []
                });
            }
            
            const group = groupedMap.get(prodId);
            
            // To handle AC units (IDU + ODU) as a single stock piece, we only count the Indoor Unit or Standard Units.
            // Outdoor Units (ODU) are tracked as serial numbers but not counted as separate stock units in the summary.
            const isOdu = item.unitType === "Outdoor Unit (ODU)";
            
            if (!isOdu) {
                group.count++;
                if (item.status === 'IN_STOCK' || item.status === 'AVAILABLE') group.inStock++;
                else if (item.status === 'SOLD') group.sold++;
                else if (item.status === 'DEFECTIVE') group.defective++;
            }
            
            group.serialNumbers.push({
                _id: item._id,
                serialNumber: item.serialNumber,
                status: item.status,
                unitType: item.unitType
            });
        });
        
        return Array.from(groupedMap.values()).sort((a, b) => 
            (a.product.name || '').localeCompare(b.product.name || '')
        );
    }
}
