import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
    constructor(
        @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    ) { }

    async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
        if (createCompanyDto.password) {
            createCompanyDto.password = await bcrypt.hash(createCompanyDto.password, 10);
        }
        const createdCompany = new this.companyModel(createCompanyDto);
        return createdCompany.save();
    }

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.companyModel.find().skip(skip).limit(limit).select('-password').exec(),
            this.companyModel.countDocuments().exec()
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findByEmail(email: string): Promise<Company | null> {
        return this.companyModel.findOne({ email }).exec();
    }

    async findOne(id: string): Promise<Company> {
        const company = await this.companyModel.findById(id).exec();
        if (!company) {
            throw new NotFoundException(`Company with ID "${id}" not found`);
        }
        return company;
    }

    async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
        const existingCompany = await this.companyModel
            .findByIdAndUpdate(id, updateCompanyDto, { new: true })
            .exec();

        if (!existingCompany) {
            throw new NotFoundException(`Company with ID "${id}" not found`);
        }
        return existingCompany;
    }

    async remove(id: string): Promise<Company> {
        const deletedCompany = await this.companyModel.findByIdAndDelete(id).exec();
        if (!deletedCompany) {
            throw new NotFoundException(`Company with ID "${id}" not found`);
        }
        return deletedCompany;
    }
}
