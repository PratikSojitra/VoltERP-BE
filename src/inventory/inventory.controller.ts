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
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Controller('inventory')
export class InventoryController {
    constructor(private readonly inventoryService: InventoryService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createInventoryDto: CreateInventoryDto, @Req() req: any) {
        if (req.user.role === Role.COMPANY) {
            createInventoryDto.company = req.user.userId;
        } else if (!createInventoryDto.company) {
            throw new ForbiddenException('Admin must provide a company ID to create an inventory record.');
        }
        return this.inventoryService.create(createInventoryDto);
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
            return this.inventoryService.findAll(req.user.userId, pageNumber, limitNumber);
        }
        return this.inventoryService.findAll(undefined, pageNumber, limitNumber);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string, @Req() req: any) {
        const inventory = await this.inventoryService.findOne(id);
        const inventoryCompanyId = (inventory.company as any)._id ? (inventory.company as any)._id.toString() : inventory.company.toString();
        if (req.user.role === Role.COMPANY && inventoryCompanyId !== req.user.userId) {
            throw new ForbiddenException('You can only access your own inventory');
        }
        return inventory;
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateInventoryDto: UpdateInventoryDto,
        @Req() req: any,
    ) {
        const inventory = await this.inventoryService.findOne(id);
        const inventoryCompanyId = (inventory.company as any)._id ? (inventory.company as any)._id.toString() : inventory.company.toString();
        if (req.user.role === Role.COMPANY && inventoryCompanyId !== req.user.userId) {
            throw new ForbiddenException('You can only update your own inventory');
        }
        return this.inventoryService.update(id, updateInventoryDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string, @Req() req: any) {
        const inventory = await this.inventoryService.findOne(id);
        const inventoryCompanyId = (inventory.company as any)._id ? (inventory.company as any)._id.toString() : inventory.company.toString();
        if (req.user.role === Role.COMPANY && inventoryCompanyId !== req.user.userId) {
            throw new ForbiddenException('You can only delete your own inventory');
        }
        return this.inventoryService.remove(id);
    }
}
