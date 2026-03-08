import { Model } from 'mongoose';
import { Payment } from './schemas/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
export declare class PaymentService {
    private readonly paymentModel;
    constructor(paymentModel: Model<Payment>);
    create(createPaymentDto: CreatePaymentDto): Promise<Payment>;
    findAll(companyId?: string, page?: number, limit?: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, Payment, {}, import("mongoose").DefaultSchemaOptions> & Payment & Required<{
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
    findOne(id: string): Promise<Payment>;
    update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment>;
    remove(id: string): Promise<Payment>;
}
