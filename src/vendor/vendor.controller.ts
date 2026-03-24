import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
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
        if (!createVendorDto.company) {
            createVendorDto.company = req.user.companyId;
        }
        return this.vendorService.create(createVendorDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.COMPANY)
    findAll(
        @Req() req: any,
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('search') search: string
    ) {
        const companyId = req.user.role === 'ADMIN' ? req.query.companyId : req.user.companyId;
        return this.vendorService.findAll(
            companyId,
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 10,
            search
        );
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.COMPANY)
    findOne(@Param('id') id: string) {
        return this.vendorService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.COMPANY)
    update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
        return this.vendorService.update(id, updateVendorDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.COMPANY)
    remove(@Param('id') id: string) {
        return this.vendorService.remove(id);
    }
}
