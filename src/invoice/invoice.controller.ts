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
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller('invoice')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createInvoiceDto: CreateInvoiceDto, @Req() req: any) {
        if (req.user.role === Role.COMPANY) {
            createInvoiceDto.company = req.user.userId;
        } else if (!createInvoiceDto.company) {
            throw new ForbiddenException('Admin must provide a company ID to create an invoice.');
        }
        return this.invoiceService.create(createInvoiceDto);
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
            return this.invoiceService.findAll(req.user.userId, pageNumber, limitNumber);
        }
        return this.invoiceService.findAll(undefined, pageNumber, limitNumber);
    }

    @Get('next-number')
    @UseGuards(JwtAuthGuard)
    async getNextNumber(@Req() req: any, @Query('companyId') companyIdQuery?: string) {
        let companyId = req.user.role === Role.COMPANY ? req.user.userId : (companyIdQuery || req.user.userId);
        if (!companyId) {
            throw new ForbiddenException('Company ID is required to generate next invoice number.');
        }
        const nextNumber = await this.invoiceService.getNextInvoiceNumber(companyId);
        return { invoiceNumber: nextNumber };
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string, @Req() req: any) {
        const invoice = await this.invoiceService.findOne(id);
        const invoiceCompanyId = (invoice.company as any)._id ? (invoice.company as any)._id.toString() : invoice.company.toString();
        if (req.user.role === Role.COMPANY && invoiceCompanyId !== req.user.userId) {
            throw new ForbiddenException('You can only access your own invoices');
        }
        return invoice;
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateInvoiceDto: UpdateInvoiceDto,
        @Req() req: any,
    ) {
        const invoice = await this.invoiceService.findOne(id);
        const invoiceCompanyId = (invoice.company as any)._id ? (invoice.company as any)._id.toString() : invoice.company.toString();
        if (req.user.role === Role.COMPANY && invoiceCompanyId !== req.user.userId) {
            throw new ForbiddenException('You can only update your own invoices');
        }
        return this.invoiceService.update(id, updateInvoiceDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string, @Req() req: any) {
        const invoice = await this.invoiceService.findOne(id);
        const invoiceCompanyId = (invoice.company as any)._id ? (invoice.company as any)._id.toString() : invoice.company.toString();
        if (req.user.role === Role.COMPANY && invoiceCompanyId !== req.user.userId) {
            throw new ForbiddenException('You can only delete your own invoices');
        }
        return this.invoiceService.remove(id);
    }
}
