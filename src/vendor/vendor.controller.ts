import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../company/schemas/company.schema';

@Controller('vendors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VendorController {
    constructor(private readonly vendorService: VendorService) { }

    @Post()
    @Roles(Role.ADMIN, Role.COMPANY)
    create(@Req() req: any, @Body() createVendorDto: CreateVendorDto) {
        if (req.user.role === Role.COMPANY) {
            createVendorDto.company = req.user.userId;
        } else if (!createVendorDto.company) {
            throw new ForbiddenException('Admin must provide a company ID to create a vendor.');
        }
        return this.vendorService.create(createVendorDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.COMPANY)
    findAll(
        @Req() req: any,
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('search') search: string,
        @Query('companyId') companyIdQuery: string
    ) {
        const companyId = req.user.role === Role.ADMIN ? companyIdQuery : req.user.userId;
        return this.vendorService.findAll(
            companyId,
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 10,
            search
        );
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.COMPANY)
    async findOne(@Param('id') id: string, @Req() req: any) {
        const vendor = await this.vendorService.findOne(id);
        const vendorCompanyId = (vendor.company as any)._id ? (vendor.company as any)._id.toString() : vendor.company.toString();
        if (req.user.role === Role.COMPANY && vendorCompanyId !== req.user.userId) {
            throw new ForbiddenException('You can only access your own vendors');
        }
        return vendor;
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.COMPANY)
    async update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto, @Req() req: any) {
        const vendor = await this.vendorService.findOne(id);
        const vendorCompanyId = (vendor.company as any)._id ? (vendor.company as any)._id.toString() : vendor.company.toString();
        if (req.user.role === Role.COMPANY && vendorCompanyId !== req.user.userId) {
            throw new ForbiddenException('You can only update your own vendors');
        }
        return this.vendorService.update(id, updateVendorDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.COMPANY)
    async remove(@Param('id') id: string, @Req() req: any) {
        const vendor = await this.vendorService.findOne(id);
        const vendorCompanyId = (vendor.company as any)._id ? (vendor.company as any)._id.toString() : vendor.company.toString();
        if (req.user.role === Role.COMPANY && vendorCompanyId !== req.user.userId) {
            throw new ForbiddenException('You can only delete your own vendors');
        }
        return this.vendorService.remove(id);
    }
}
