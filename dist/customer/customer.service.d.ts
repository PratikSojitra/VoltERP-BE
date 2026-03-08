import { Model } from 'mongoose';
import { Customer } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomerService {
    private readonly customerModel;
    constructor(customerModel: Model<Customer>);
    create(createCustomerDto: CreateCustomerDto): Promise<Customer>;
    findAll(companyId?: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, Customer, {}, import("mongoose").DefaultSchemaOptions> & Customer & Required<{
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
    findOne(id: string): Promise<Customer>;
    update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer>;
    remove(id: string): Promise<Customer>;
}
