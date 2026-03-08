import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

    async findAll(companyId?: string, page: number = 1, limit: number = 10) {
        const filter = companyId ? { company: companyId } : {};
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.inventoryModel.find(filter).skip(skip).limit(limit).populate('product').populate('company').exec(),
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
}
