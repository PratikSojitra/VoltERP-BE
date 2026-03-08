import { Model } from 'mongoose';
import { Company } from './schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompanyService {
    private readonly companyModel;
    constructor(companyModel: Model<Company>);
    create(createCompanyDto: CreateCompanyDto): Promise<Company>;
    findAll(page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, Company, {}, import("mongoose").DefaultSchemaOptions> & Company & Required<{
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
    findByEmail(email: string): Promise<Company | null>;
    findOne(id: string): Promise<Company>;
    update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company>;
    remove(id: string): Promise<Company>;
}
