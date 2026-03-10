import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { Inventory, InventorySchema } from '../inventory/schemas/inventory.schema';
import { Payment, PaymentSchema } from '../payment/schemas/payment.schema';
import { Product, ProductSchema } from '../product/schemas/product.schema';
import { Customer, CustomerSchema } from '../customer/schemas/customer.schema';
import { Company, CompanySchema } from '../company/schemas/company.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Inventory.name, schema: InventorySchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: Company.name, schema: CompanySchema },
    ])
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule { }
