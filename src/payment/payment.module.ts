import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { Invoice, InvoiceSchema } from '../invoice/schemas/invoice.schema';
import { Customer, CustomerSchema } from '../customer/schemas/customer.schema';
import { Purchase, PurchaseSchema } from '../purchase/schemas/purchase.schema';
import { Vendor, VendorSchema } from '../vendor/schemas/vendor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: Purchase.name, schema: PurchaseSchema },
      { name: Vendor.name, schema: VendorSchema },
    ])
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule { }
