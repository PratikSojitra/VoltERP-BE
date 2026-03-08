import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    create(createCompanyDto: CreateCompanyDto): Promise<import("./schemas/company.schema").Company>;
    findAll(req: any, page?: string, limit?: string): Promise<{
        data: import("./schemas/company.schema").Company[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string, req: any): Promise<import("./schemas/company.schema").Company>;
    update(id: string, updateCompanyDto: UpdateCompanyDto, req: any): Promise<import("./schemas/company.schema").Company>;
    remove(id: string, req: any): Promise<import("./schemas/company.schema").Company>;
}
