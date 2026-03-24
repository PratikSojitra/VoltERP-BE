import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../company/schemas/company.schema';

@Controller('purchases')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) { }

    @Post()
    @Roles(Role.ADMIN, Role.COMPANY)
    create(@Req() req: any, @Body() createPurchaseDto: CreatePurchaseDto) {
        if (req.user.role === Role.COMPANY) {
            createPurchaseDto.company = req.user.userId;
        } else if (!createPurchaseDto.company) {
            throw new ForbiddenException('Admin must provide a company ID.');
        }
        return this.purchaseService.create(createPurchaseDto);
    }

    @Get('next-number')
    @Roles(Role.ADMIN, Role.COMPANY)
    async getNextNumber(@Req() req: any, @Query('companyId') companyIdQuery?: string) {
        const companyId = req.user.role === Role.COMPANY
            ? req.user.userId
            : ((companyIdQuery === 'undefined' ? undefined : companyIdQuery) || req.user.userId);
        if (!companyId) {
            throw new ForbiddenException('Company ID is required to generate next purchase number.');
        }
        const nextNumber = await this.purchaseService.getNextPurchaseNumber(companyId);
        return { invoiceNumber: nextNumber };
    }

    @Get()
    @Roles(Role.ADMIN, Role.COMPANY)
    findAll(
        @Req() req: any,
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('search') search: string,
        @Query('companyId') companyIdQuery?: string
    ) {
        const companyId = req.user.role === Role.COMPANY ? req.user.userId : (companyIdQuery === 'undefined' ? undefined : companyIdQuery);
        return this.purchaseService.findAll(
            companyId,
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 10,
            search
        );
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.COMPANY)
    findOne(@Param('id') id: string) {
        return this.purchaseService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.COMPANY)
    update(@Param('id') id: string, @Body() updatePurchaseDto: UpdatePurchaseDto) {
        return this.purchaseService.update(id, updatePurchaseDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.COMPANY)
    remove(@Param('id') id: string) {
        return this.purchaseService.remove(id);
    }
}
