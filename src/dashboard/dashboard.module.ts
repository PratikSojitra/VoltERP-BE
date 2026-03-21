import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Company, CompanySchema } from '../company/schemas/company.schema';
import { Customer, CustomerSchema } from '../customer/schemas/customer.schema';
import { Inventory, InventorySchema } from '../inventory/schemas/inventory.schema';
import { Invoice, InvoiceSchema } from '../invoice/schemas/invoice.schema';
import { Payment, PaymentSchema } from '../payment/schemas/payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: Inventory.name, schema: InventorySchema },
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Payment.name, schema: PaymentSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
