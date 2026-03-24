import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor } from './schemas/vendor.schema';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorService {
    constructor(
        @InjectModel(Vendor.name) private readonly vendorModel: Model<Vendor>,
    ) { }

    async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
        const createdVendor = new this.vendorModel(createVendorDto);
        return createdVendor.save();
    }

    async findAll(companyId?: string, page: number = 1, limit: number = 10, search?: string) {
        let filter: any = companyId ? { company: companyId } : {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.vendorModel.find(filter).skip(skip).limit(limit).populate('company').exec(),
            this.vendorModel.countDocuments(filter).exec()
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findOne(id: string): Promise<Vendor> {
        const vendor = await this.vendorModel.findById(id).populate('company').exec();
        if (!vendor) {
            throw new NotFoundException(`Vendor with ID "${id}" not found`);
        }
        return vendor;
    }

    async update(id: string, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
        const existingVendor = await this.vendorModel
            .findByIdAndUpdate(id, updateVendorDto, { new: true })
            .exec();

        if (!existingVendor) {
            throw new NotFoundException(`Vendor with ID "${id}" not found`);
        }
        return existingVendor;
    }

    async remove(id: string): Promise<Vendor> {
        const deletedVendor = await this.vendorModel.findByIdAndDelete(id).exec();
        if (!deletedVendor) {
            throw new NotFoundException(`Vendor with ID "${id}" not found`);
        }
        return deletedVendor;
    }
}
