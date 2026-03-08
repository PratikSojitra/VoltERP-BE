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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createProductDto: CreateProductDto, @Req() req: any) {
        if (req.user.role === Role.COMPANY) {
            createProductDto.company = req.user.userId;
        } else if (!createProductDto.company) {
            throw new ForbiddenException('Admin must provide a company ID to create a product.');
        }
        return this.productService.create(createProductDto);
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
            return this.productService.findAll(req.user.userId, pageNumber, limitNumber);
        }
        return this.productService.findAll(undefined, pageNumber, limitNumber);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string, @Req() req: any) {
        const product = await this.productService.findOne(id);
        const productCompanyId = (product.company as any)._id ? (product.company as any)._id.toString() : product.company.toString();
        if (req.user.role === Role.COMPANY && productCompanyId !== req.user.userId) {
            throw new ForbiddenException('You can only access your own products');
        }
        return product;
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @Req() req: any) {
        const product = await this.productService.findOne(id);
        const productCompanyId = (product.company as any)._id ? (product.company as any)._id.toString() : product.company.toString();
        if (req.user.role === Role.COMPANY && productCompanyId !== req.user.userId) {
            throw new ForbiddenException('You can only update your own products');
        }
        return this.productService.update(id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string, @Req() req: any) {
        const product = await this.productService.findOne(id);
        const productCompanyId = (product.company as any)._id ? (product.company as any)._id.toString() : product.company.toString();
        if (req.user.role === Role.COMPANY && productCompanyId !== req.user.userId) {
            throw new ForbiddenException('You can only delete your own products');
        }
        return this.productService.remove(id);
    }
}
