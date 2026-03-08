import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './schemas/payment.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    ) { }

    async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
        const createdPayment = new this.paymentModel(createPaymentDto);
        return createdPayment.save();
    }

    async findAll(companyId?: string, page: number = 1, limit: number = 10) {
        const filter = companyId ? { company: companyId } : {};
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.paymentModel
                .find(filter)
                .skip(skip)
                .limit(limit)
                .populate('customer')
                .populate('company')
                .exec(),
            this.paymentModel.countDocuments(filter).exec()
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findOne(id: string): Promise<Payment> {
        const payment = await this.paymentModel
            .findById(id)
            .populate('customer')
            .populate('company')
            .exec();
        if (!payment) {
            throw new NotFoundException(`Payment record with ID "${id}" not found`);
        }
        return payment;
    }

    async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
        const existingPayment = await this.paymentModel
            .findByIdAndUpdate(id, updatePaymentDto, { new: true })
            .exec();

        if (!existingPayment) {
            throw new NotFoundException(`Payment record with ID "${id}" not found`);
        }
        return existingPayment;
    }

    async remove(id: string): Promise<Payment> {
        const deletedPayment = await this.paymentModel.findByIdAndDelete(id).exec();
        if (!deletedPayment) {
            throw new NotFoundException(`Payment record with ID "${id}" not found`);
        }
        return deletedPayment;
    }
}
