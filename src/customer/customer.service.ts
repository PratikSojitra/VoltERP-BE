import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
    constructor(
        @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
    ) { }

    async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
        const createdCustomer = new this.customerModel(createCustomerDto);
        return createdCustomer.save();
    }

    async findAll(companyId?: string, page: number = 1, limit: number = 10) {
        const filter = companyId ? { company: companyId } : {};
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.customerModel.find(filter).skip(skip).limit(limit).populate('company').exec(),
            this.customerModel.countDocuments(filter).exec()
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findOne(id: string): Promise<Customer> {
        const customer = await this.customerModel.findById(id).populate('company').exec();
        if (!customer) {
            throw new NotFoundException(`Customer with ID "${id}" not found`);
        }
        return customer;
    }

    async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
        const existingCustomer = await this.customerModel
            .findByIdAndUpdate(id, updateCustomerDto, { new: true })
            .exec();

        if (!existingCustomer) {
            throw new NotFoundException(`Customer with ID "${id}" not found`);
        }
        return existingCustomer;
    }

    async remove(id: string): Promise<Customer> {
        const deletedCustomer = await this.customerModel.findByIdAndDelete(id).exec();
        if (!deletedCustomer) {
            throw new NotFoundException(`Customer with ID "${id}" not found`);
        }
        return deletedCustomer;
    }
}
