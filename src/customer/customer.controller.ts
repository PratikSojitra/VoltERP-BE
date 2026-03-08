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
import { Role } from '../company/schemas/company.schema';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createCustomerDto: CreateCustomerDto, @Req() req: any) {
        if (req.user.role === Role.COMPANY) {
            createCustomerDto.company = req.user.userId;
        } else if (!createCustomerDto.company) {
            throw new ForbiddenException('Admin must provide a company ID to create a customer.');
        }
        return this.customerService.create(createCustomerDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(
        @Req() req: any,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 10;

        if (req.user.role === Role.COMPANY) {
            return this.customerService.findAll(req.user.userId, pageNumber, limitNumber);
        }
        return this.customerService.findAll(undefined, pageNumber, limitNumber);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string, @Req() req: any) {
        const customer = await this.customerService.findOne(id);
        const customerCompanyId = (customer.company as any)._id ? (customer.company as any)._id.toString() : customer.company.toString();
        if (req.user.role === Role.COMPANY && customerCompanyId !== req.user.userId) {
            throw new ForbiddenException('You can only access your own customers');
        }
        return customer;
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateCustomerDto: UpdateCustomerDto,
        @Req() req: any,
    ) {
        const customer = await this.customerService.findOne(id);
        const customerCompanyId = (customer.company as any)._id ? (customer.company as any)._id.toString() : customer.company.toString();
        if (req.user.role === Role.COMPANY && customerCompanyId !== req.user.userId) {
            throw new ForbiddenException('You can only update your own customers');
        }
        return this.customerService.update(id, updateCustomerDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string, @Req() req: any) {
        const customer = await this.customerService.findOne(id);
        const customerCompanyId = (customer.company as any)._id ? (customer.company as any)._id.toString() : customer.company.toString();
        if (req.user.role === Role.COMPANY && customerCompanyId !== req.user.userId) {
            throw new ForbiddenException('You can only delete your own customers');
        }
        return this.customerService.remove(id);
    }
}
