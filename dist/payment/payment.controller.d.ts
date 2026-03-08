import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    create(createPaymentDto: CreatePaymentDto, req: any): Promise<import("./schemas/payment.schema").Payment>;
    findAll(req: any, page?: string, limit?: string): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/payment.schema").Payment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/payment.schema").Payment & Required<{
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
    findOne(id: string, req: any): Promise<import("./schemas/payment.schema").Payment>;
    update(id: string, updatePaymentDto: UpdatePaymentDto, req: any): Promise<import("./schemas/payment.schema").Payment>;
    remove(id: string, req: any): Promise<import("./schemas/payment.schema").Payment>;
}
