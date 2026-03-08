import { Model } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Inventory } from '../inventory/schemas/inventory.schema';
import { Payment } from '../payment/schemas/payment.schema';
export declare class InvoiceService {
    private readonly invoiceModel;
    private readonly inventoryModel;
    private readonly paymentModel;
    constructor(invoiceModel: Model<Invoice>, inventoryModel: Model<Inventory>, paymentModel: Model<Payment>);
    create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice>;
    getNextInvoiceNumber(companyId: string): Promise<string>;
    findAll(companyId?: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, Invoice, {}, import("mongoose").DefaultSchemaOptions> & Invoice & Required<{
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
    findOne(id: string): Promise<Invoice>;
    update(id: string, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice>;
    remove(id: string): Promise<Invoice>;
}
