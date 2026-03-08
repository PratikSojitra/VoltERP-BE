import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { Inventory, InventorySchema } from '../inventory/schemas/inventory.schema';
import { Payment, PaymentSchema } from '../payment/schemas/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Inventory.name, schema: InventorySchema },
      { name: Payment.name, schema: PaymentSchema },
    ])
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule { }
