import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    create(createCustomerDto: CreateCustomerDto, req: any): Promise<import("./schemas/customer.schema").Customer>;
    findAll(req: any, page?: string, limit?: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/customer.schema").Customer, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/customer.schema").Customer & Required<{
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
    findOne(id: string, req: any): Promise<import("./schemas/customer.schema").Customer>;
    update(id: string, updateCustomerDto: UpdateCustomerDto, req: any): Promise<import("./schemas/customer.schema").Customer>;
    remove(id: string, req: any): Promise<import("./schemas/customer.schema").Customer>;
}
