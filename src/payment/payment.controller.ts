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
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createPaymentDto: CreatePaymentDto, @Req() req: any) {
        if (req.user.role === Role.COMPANY) {
            createPaymentDto.company = req.user.userId;
        } else if (!createPaymentDto.company) {
            throw new ForbiddenException('Admin must provide a company ID to record a payment.');
        }
        return this.paymentService.create(createPaymentDto);
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
            return this.paymentService.findAll(req.user.userId, pageNumber, limitNumber);
        }
        return this.paymentService.findAll(undefined, pageNumber, limitNumber);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string, @Req() req: any) {
        const payment = await this.paymentService.findOne(id);
        const paymentCompanyId = (payment.company as any)._id ? (payment.company as any)._id.toString() : payment.company.toString();
        if (req.user.role === Role.COMPANY && paymentCompanyId !== req.user.userId) {
            throw new ForbiddenException('You can only access your own payments');
        }
        return payment;
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updatePaymentDto: UpdatePaymentDto,
        @Req() req: any,
    ) {
        const payment = await this.paymentService.findOne(id);
        const paymentCompanyId = (payment.company as any)._id ? (payment.company as any)._id.toString() : payment.company.toString();
        if (req.user.role === Role.COMPANY && paymentCompanyId !== req.user.userId) {
            throw new ForbiddenException('You can only update your own payments');
        }
        return this.paymentService.update(id, updatePaymentDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string, @Req() req: any) {
        const payment = await this.paymentService.findOne(id);
        const paymentCompanyId = (payment.company as any)._id ? (payment.company as any)._id.toString() : payment.company.toString();
        if (req.user.role === Role.COMPANY && paymentCompanyId !== req.user.userId) {
            throw new ForbiddenException('You can only delete your own payments');
        }
        return this.paymentService.remove(id);
    }
}
