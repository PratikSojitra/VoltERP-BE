import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Purchase } from './schemas/purchase.schema';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Inventory } from '../inventory/schemas/inventory.schema';
import { Payment } from '../payment/schemas/payment.schema';

@Injectable()
export class PurchaseService {
    constructor(
        @InjectModel(Purchase.name) private readonly purchaseModel: Model<Purchase>,
        @InjectModel(Inventory.name) private readonly inventoryModel: Model<Inventory>,
        @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    ) { }

    async create(createPurchaseDto: CreatePurchaseDto): Promise<Purchase> {
        // Auto-generate purchase number if not provided
        if (!createPurchaseDto.invoiceNumber) {
            createPurchaseDto.invoiceNumber = await this.getNextPurchaseNumber(createPurchaseDto.company as string);
        }

        // Duplicate check
        const existing = await this.purchaseModel.findOne({ invoiceNumber: createPurchaseDto.invoiceNumber }).exec();
        if (existing) {
            throw new ConflictException(`Purchase number ${createPurchaseDto.invoiceNumber} already exists.`);
        }

        // Validate items and serial numbers
        this.validateItems(createPurchaseDto.items, createPurchaseDto.status);

        // By default, we assume it's unpaid unless user provides a complex workflow.
        // But the user's prompt says "when we add Purchases record we need to create payment as invoice".
        // Let's create an auto-payment if it's COMPLETED.
        
        const createdPurchase = new this.purchaseModel(createPurchaseDto);
        const savedPurchase = await createdPurchase.save();

        if (savedPurchase.status !== 'CANCELLED') {
            const isCompleted = savedPurchase.status === 'COMPLETED';
            
            if (isCompleted) {
                await this.syncInventoryForPurchase(savedPurchase);
            }
            
            // Create automatic payment record
            const autoPayment = new this.paymentModel({
                purchase: savedPurchase._id,
                vendor: savedPurchase.vendor,
                company: savedPurchase.company,
                amount: savedPurchase.grandTotal,
                paymentDate: savedPurchase.purchaseDate || new Date(),
                paymentMethod: 'CASH', // Default
                status: isCompleted ? 'COMPLETED' : 'PENDING',
                type: 'PURCHASE',
                referenceNumber: `AUTO-${savedPurchase.invoiceNumber}`,
                notes: `Auto-generated payment record for purchase ${savedPurchase.invoiceNumber}`
            });
            await autoPayment.save();

            savedPurchase.paidAmount = isCompleted ? savedPurchase.grandTotal : 0;
            savedPurchase.outstandingAmount = isCompleted ? 0 : savedPurchase.grandTotal;
            await savedPurchase.save();
        }

        return savedPurchase;
    }

    async findAll(companyId?: string, page: number = 1, limit: number = 10, search?: string) {
        let filter: any = companyId ? { company: companyId } : {};

        if (search) {
            filter.$or = [
                { invoiceNumber: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.purchaseModel.find(filter)
                .skip(skip)
                .limit(limit)
                .populate('vendor')
                .populate('items.product')
                .populate('company')
                .sort({ createdAt: -1 })
                .exec(),
            this.purchaseModel.countDocuments(filter).exec()
        ]);

        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findOne(id: string): Promise<Purchase> {
        const purchase = await this.purchaseModel.findById(id)
            .populate('vendor')
            .populate('items.product')
            .populate('company')
            .exec();

        if (!purchase) {
            throw new NotFoundException(`Purchase with ID "${id}" not found`);
        }
        return purchase;
    }

    async update(id: string, updatePurchaseDto: UpdatePurchaseDto): Promise<Purchase> {
        const existingPurchase = await this.purchaseModel.findById(id).exec();
        if (!existingPurchase) {
            throw new NotFoundException(`Purchase with ID "${id}" not found`);
        }

        // Validate items if provided
        if (updatePurchaseDto.items) {
            this.validateItems(updatePurchaseDto.items, updatePurchaseDto.status || existingPurchase.status);
        }

        const updatedPurchase = await this.purchaseModel
            .findByIdAndUpdate(id, updatePurchaseDto, { new: true })
            .exec();

        if (!updatedPurchase) {
            throw new NotFoundException(`Purchase with ID "${id}" not found after update`);
        }

        if (updatedPurchase.status === 'COMPLETED') {
            await this.syncInventoryForPurchase(updatedPurchase);
        } else if (existingPurchase.status === 'COMPLETED' && updatedPurchase.status !== 'COMPLETED') {
            await this.removeInventoryForPurchase(id);
        }

        // Sync with Payment record
        const payment = await this.paymentModel.findOne({ purchase: id });
        if (payment) {
            payment.amount = updatedPurchase.grandTotal;
            if (updatedPurchase.status === 'COMPLETED') {
                payment.status = 'COMPLETED';
            } else if (updatedPurchase.status === 'CANCELLED') {
                payment.status = 'FAILED';
            } else {
                payment.status = 'PENDING';
            }
            await payment.save();
        }

        // Update paid/outstanding amounts on purchase
        const isPaid = (payment && payment.status === 'COMPLETED');
        updatedPurchase.paidAmount = isPaid ? updatedPurchase.grandTotal : 0;
        updatedPurchase.outstandingAmount = isPaid ? 0 : updatedPurchase.grandTotal;
        await updatedPurchase.save();

        return updatedPurchase as Purchase;
    }

    async remove(id: string): Promise<Purchase> {
        const existingPurchase = await this.purchaseModel.findById(id).exec();
        if (!existingPurchase) {
            throw new NotFoundException(`Purchase with ID "${id}" not found`);
        }

        await this.removeInventoryForPurchase(id);
        await this.paymentModel.deleteMany({ purchase: id }).exec();
        await this.purchaseModel.findByIdAndDelete(id).exec();
        return existingPurchase;
    }

    async getNextPurchaseNumber(companyId: string): Promise<string> {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-indexed

        let startYear: number, endYear: number;
        if (month >= 3) { // April onwards = new FY
            startYear = year;
            endYear = year + 1;
        } else {
            startYear = year - 1;
            endYear = year;
        }

        const fy = `${startYear}-${endYear}`;

        const purchases = await this.purchaseModel.find({
            company: companyId,
            invoiceNumber: new RegExp(`\/PUR\/${fy}$`)
        }).exec();

        let maxSeq = 0;
        for (const p of purchases) {
            const match = p.invoiceNumber.match(/^(\d+)\/PUR\//);
            if (match) {
                const seq = parseInt(match[1], 10);
                if (seq > maxSeq) maxSeq = seq;
            }
        }

        const nextSeq = maxSeq + 1;
        return `${nextSeq.toString().padStart(2, '0')}/PUR/${fy}`;
    }

    private validateItems(items: any[], status?: string) {
        if (!items || items.length === 0) {
            throw new BadRequestException('Purchase must have at least one item');
        }

        for (const item of items) {
            if (status === 'COMPLETED') {
                if (!item.serialNumbers || item.serialNumbers.length !== item.quantity) {
                    throw new BadRequestException(
                        `When status is COMPLETED, you must provide exactly ${item.quantity} serial numbers for the given quantity.`
                    );
                }
            } else {
                if (item.serialNumbers && item.serialNumbers.length > item.quantity) {
                    throw new BadRequestException(
                        `You cannot provide more serial numbers (${item.serialNumbers.length}) than the item quantity (${item.quantity}).`
                    );
                }
            }
        }
    }

    private async syncInventoryForPurchase(purchase: Purchase) {
        // Find existing inventory items for this purchase
        const existingInventoryItems = await this.inventoryModel.find({ purchase: purchase._id }).exec();
        
        // Build a list of all serial numbers that SHOULD exist
        const desiredSerialNumbers = new Set<string>();
        for (const item of purchase.items) {
            if (item.serialNumbers) {
                for (const sn of item.serialNumbers) {
                    desiredSerialNumbers.add(sn);
                }
            }
        }

        // Determine which ones to delete (exist in DB but not in desired list)
        const itemsToDelete = existingInventoryItems.filter(item => !desiredSerialNumbers.has(item.serialNumber));
        for (const item of itemsToDelete) {
            if (item.status === 'SOLD') {
                throw new BadRequestException(`Cannot remove serial number ${item.serialNumber} because it is already SOLD`);
            }
            await this.inventoryModel.findByIdAndDelete(item._id).exec();
        }

        // Determine which ones to add (in desired list but not in DB)
        const existingSerialNumbers = new Set(existingInventoryItems.map(item => item.serialNumber));
        
        for (const item of purchase.items) {
            if (item.serialNumbers) {
                for (const sn of item.serialNumbers) {
                    if (!existingSerialNumbers.has(sn)) {
                        const newInventory = new this.inventoryModel({
                            product: item.product,
                            serialNumber: sn,
                            unitType: item.unitType || 'Standard Unit',
                            status: 'IN_STOCK',
                            purchase: purchase._id,
                            company: purchase.company,
                        });
                        await newInventory.save();
                    } else {
                        // Optional: Update existing inventory item if product or unitType changed
                        const existingItem = existingInventoryItems.find(i => i.serialNumber === sn);
                        if (existingItem) {
                            let updated = false;
                            if (existingItem.product.toString() !== (item.product as any)._id?.toString() && existingItem.product.toString() !== item.product.toString()) {
                                existingItem.product = item.product as any;
                                updated = true;
                            }
                            if (existingItem.unitType !== item.unitType) {
                                existingItem.unitType = item.unitType;
                                updated = true;
                            }
                            if (updated) {
                                await existingItem.save();
                            }
                        }
                    }
                }
            }
        }
    }

    private async removeInventoryForPurchase(purchaseId: string) {
        const existingInventoryItems = await this.inventoryModel.find({ purchase: purchaseId }).exec();
        for (const item of existingInventoryItems) {
            if (item.status === 'SOLD') {
                throw new BadRequestException(`Cannot delete purchase, serial number ${item.serialNumber} is already SOLD`);
            }
            await this.inventoryModel.findByIdAndDelete(item._id).exec();
        }
    }
}
