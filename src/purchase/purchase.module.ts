import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { Purchase, PurchaseSchema } from './schemas/purchase.schema';
import { InventoryModule } from '../inventory/inventory.module';
import { Payment, PaymentSchema } from '../payment/schemas/payment.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Purchase.name, schema: PurchaseSchema },
            { name: Payment.name, schema: PaymentSchema }
        ]),
        InventoryModule
    ],
    controllers: [PurchaseController],
    providers: [PurchaseService],
    exports: [PurchaseService],
})
export class PurchaseModule { }
