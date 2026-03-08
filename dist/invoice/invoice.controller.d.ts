import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
export declare class InvoiceController {
    private readonly invoiceService;
    constructor(invoiceService: InvoiceService);
    create(createInvoiceDto: CreateInvoiceDto, req: any): Promise<import("./schemas/invoice.schema").Invoice>;
    findAll(req: any, page?: string, limit?: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/invoice.schema").Invoice, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/invoice.schema").Invoice & Required<{
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
    getNextNumber(req: any, companyIdQuery?: string): Promise<{
        invoiceNumber: string;
    }>;
    findOne(id: string, req: any): Promise<import("./schemas/invoice.schema").Invoice>;
    update(id: string, updateInvoiceDto: UpdateInvoiceDto, req: any): Promise<import("./schemas/invoice.schema").Invoice>;
    remove(id: string, req: any): Promise<import("./schemas/invoice.schema").Invoice>;
}
