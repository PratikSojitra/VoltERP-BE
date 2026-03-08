import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(createProductDto: CreateProductDto, req: any): Promise<import("./schemas/product.schema").Product>;
    findAll(req: any, page?: string, limit?: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/product.schema").Product, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/product.schema").Product & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string, req: any): Promise<import("./schemas/product.schema").Product>;
    update(id: string, updateProductDto: UpdateProductDto, req: any): Promise<import("./schemas/product.schema").Product>;
    remove(id: string, req: any): Promise<import("./schemas/product.schema").Product>;
}
