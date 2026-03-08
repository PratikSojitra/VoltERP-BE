import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<Product>,
    ) { }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const createdProduct = new this.productModel(createProductDto);
        return createdProduct.save();
    }

    async findAll(companyId?: string, page: number = 1, limit: number = 10) {
        const filter = companyId ? { company: companyId } : {};
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.productModel.find(filter).skip(skip).limit(limit).populate('company').exec(),
            this.productModel.countDocuments(filter).exec()
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.productModel.findById(id).populate('company').exec();
        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        const existingProduct = await this.productModel
            .findByIdAndUpdate(id, updateProductDto, { new: true })
            .exec();

        if (!existingProduct) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        return existingProduct;
    }

    async remove(id: string): Promise<Product> {
        const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
        if (!deletedProduct) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        return deletedProduct;
    }
}
