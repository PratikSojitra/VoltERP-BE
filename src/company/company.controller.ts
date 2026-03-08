import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    ForbiddenException,
    Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from './schemas/company.schema';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }

    @Post()
    create(@Body() createCompanyDto: CreateCompanyDto) {
        return this.companyService.create(createCompanyDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(
        @Req() req: any,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 10;
        if (req.user.role === Role.COMPANY) {
            const company = await this.companyService.findOne(req.user.userId);
            return { data: [company], total: 1, page: 1, limit: limitNumber, totalPages: 1 };
        }
        return this.companyService.findAll(pageNumber, limitNumber);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string, @Req() req: any) {
        if (req.user.role === Role.COMPANY && req.user.userId !== id) {
            throw new ForbiddenException('You can only access your own company profile');
        }
        return this.companyService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @Req() req: any) {
        if (req.user.role === Role.COMPANY && req.user.userId !== id) {
            throw new ForbiddenException('You can only update your own company profile');
        }
        return this.companyService.update(id, updateCompanyDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string, @Req() req: any) {
        if (req.user.role === Role.COMPANY && req.user.userId !== id) {
            throw new ForbiddenException('You are not allowed to delete this company profile');
        }
        return this.companyService.remove(id);
    }
}
