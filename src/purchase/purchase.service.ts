import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Purchase } from './schemas/purchase.schema';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Inventory } from '../inventory/schemas/inventory.schema';
import { Payment } from '../payment/schemas/payment.schema';
import { Invoice } from '../invoice/schemas/invoice.schema';

@Injectable()
export class PurchaseService {
    constructor(
        @InjectModel(Purchase.name) private readonly purchaseModel: Model<Purchase>,
        @InjectModel(Inventory.name) private readonly inventoryModel: Model<Inventory>,
        @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
        @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
    ) { }

    async create(createPurchaseDto: CreatePurchaseDto): Promise<Purchase> {
        // Auto-generate purchase number if not provided
        if (!createPurchaseDto.invoiceNumber) {
            createPurchaseDto.invoiceNumber = await this.getNextPurchaseNumber(createPurchaseDto.company as string);
        }

        // As per user request: Purchases are always COMPLETED by default at creation and update
        createPurchaseDto.status = 'COMPLETED';

        // Duplicate check
        const existing = await this.purchaseModel.findOne({ 
            invoiceNumber: createPurchaseDto.invoiceNumber,
            company: createPurchaseDto.company
        }).exec();
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
            
            // Create automatic payment record (always PENDING initially as per user request)
            const autoPayment = new this.paymentModel({
                purchase: savedPurchase._id,
                vendor: savedPurchase.vendor,
                company: savedPurchase.company,
                amount: savedPurchase.grandTotal,
                paymentDate: savedPurchase.purchaseDate || new Date(),
                paymentMethod: 'CASH', // Default
                status: 'PENDING',
                type: 'PURCHASE',
                referenceNumber: `AUTO-${savedPurchase.invoiceNumber}`,
                notes: `Auto-generated payment record for purchase ${savedPurchase.invoiceNumber}`
            });
            await autoPayment.save();

            // Always start with 0 paid amount and full outstanding for new purchases (paid via separate payment workflow)
            savedPurchase.paidAmount = 0;
            savedPurchase.outstandingAmount = savedPurchase.grandTotal;
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

        // Duplicate check if invoiceNumber is changed
        if (updatePurchaseDto.invoiceNumber && updatePurchaseDto.invoiceNumber !== existingPurchase.invoiceNumber) {
            const duplicate = await this.purchaseModel.findOne({ 
                invoiceNumber: updatePurchaseDto.invoiceNumber,
                company: existingPurchase.company
            }).exec();
            if (duplicate) {
                throw new ConflictException(`Purchase number ${updatePurchaseDto.invoiceNumber} is already generated.`);
            }
        }

        // Validate items if provided
        if (updatePurchaseDto.items) {
            this.validateItems(updatePurchaseDto.items, updatePurchaseDto.status || existingPurchase.status);
        }

        // Force COMPLETED status as per user request to simplify purchase tracking
        updatePurchaseDto.status = 'COMPLETED';

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
            if (updatedPurchase.status === 'CANCELLED') {
                payment.status = 'FAILED';
            }
            // Decoupled payment status from purchase status as per user request. 
            // Payment status should be managed separately or when actual payment is recorded.
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
                const hasODU = item.serialNumbersODU && item.serialNumbersODU.length > 0;
                if (hasODU) {
                    if (!item.serialNumbers || item.serialNumbers.length !== item.quantity || item.serialNumbersODU.length !== item.quantity) {
                        throw new BadRequestException(
                            `When providing both Indoor and Outdoor serials, you must provide exactly ${item.quantity} of each.`
                        );
                    }
                } else if (!item.serialNumbers || item.serialNumbers.length !== item.quantity) {
                    throw new BadRequestException(
                        `When status is COMPLETED, you must provide exactly ${item.quantity} serial numbers for the given quantity.`
                    );
                }
            } else {
                if (item.serialNumbers && item.serialNumbers.length > item.quantity) {
                    throw new BadRequestException(
                        `You cannot provide more serial numbers than the item quantity.`
                    );
                }
                if (item.serialNumbersODU && item.serialNumbersODU.length > item.quantity) {
                    throw new BadRequestException(
                        `You cannot provide more ODU serial numbers than the item quantity.`
                    );
                }
            }
        }
    }

    private async syncInventoryForPurchase(purchase: Purchase) {
        // Find all existing inventory items for this purchase
        const existingInventoryItems = await this.inventoryModel.find({ purchase: purchase._id }).exec();
        const workingCopy = [...existingInventoryItems];

        for (const item of purchase.items) {
            const hasODU = item.serialNumbersODU && item.serialNumbersODU.length > 0;
            
            // 1. Process standard/IDU serials
            const iduUnitType = hasODU ? "Indoor Unit (IDU)" : (item.unitType || 'Standard Unit');
            const iduSerials = item.serialNumbers || [];
            await this.syncItemGroup(item.product, iduUnitType, iduSerials, purchase, workingCopy);
            
            // 2. Process ODU serials if any
            if (hasODU) {
                const oduSerials = item.serialNumbersODU || [];
                await this.syncItemGroup(item.product, "Outdoor Unit (ODU)", oduSerials, purchase, workingCopy);
            }
        }

        // 3. Any leftover existing inventory items that weren't matched should be deleted
        for (const leftover of workingCopy) {
            if (leftover.status === 'SOLD') {
                // Double check if it's actually referenced by an invoice
                const isReferenced = await this.invoiceModel.findOne({ 
                    'items.inventory': leftover._id 
                }).exec();
                
                if (isReferenced) {
                    throw new BadRequestException(
                        `Cannot remove serial number ${leftover.serialNumber} because it is already SOLD in Invoice ${isReferenced.invoiceNumber}`
                    );
                }
            }
            await this.inventoryModel.findByIdAndDelete(leftover._id).exec();
        }
    }

    private async syncItemGroup(productId: any, unitType: string, desiredSerials: string[], purchase: Purchase, workingCopy: any[]) {
        const prodIdStr = productId._id ? productId._id.toString() : productId.toString();
        
        // 1. Get all existing records for this group that are still in workingCopy
        const matches = workingCopy.filter(i => 
            i.product.toString() === prodIdStr && 
            i.unitType === unitType
        );

        const remainingDesired = [...desiredSerials];
        const processedRecords = new Set<string>();

        // 2. First Pass: Match exact serial numbers to preserve identity and status
        // Sort matches to prioritize SOLD items so we don't accidentally try to delete them if duplicates exist
        const sortedMatches = [...matches].sort((a, b) => (a.status === 'SOLD' ? -1 : 1));

        for (let i = remainingDesired.length - 1; i >= 0; i--) {
            const sn = remainingDesired[i];
            const foundIdx = sortedMatches.findIndex(m => m.serialNumber === sn && !processedRecords.has(m._id.toString()));
            
            if (foundIdx > -1) {
                const record = sortedMatches[foundIdx];
                processedRecords.add(record._id.toString());
                remainingDesired.splice(i, 1);
                
                // Remove from the original matches array
                const mIdx = matches.findIndex(m => m._id.toString() === record._id.toString());
                if (mIdx > -1) matches.splice(mIdx, 1);
                
                // Remove from workingCopy as it's fully matched
                const wcIdx = workingCopy.findIndex(wc => wc._id.toString() === record._id.toString());
                if (wcIdx > -1) workingCopy.splice(wcIdx, 1);
            }
        }

        // 3. Second Pass: Update remaining matches with remaining desired serials
        while (matches.length > 0 && remainingDesired.length > 0) {
            const record = matches.shift();
            const newSn = remainingDesired.shift();
            
            if (record.serialNumber !== newSn) {
                record.serialNumber = newSn;
                await record.save();
            }
            
            // Remove from workingCopy
            const wcIdx = workingCopy.findIndex(wc => wc._id.toString() === record._id.toString());
            if (wcIdx > -1) workingCopy.splice(wcIdx, 1);
        }

        // 4. Third Pass: Create new records for leftover desired serials
        for (const sn of remainingDesired) {
            const newInventory = new this.inventoryModel({
                product: productId,
                serialNumber: sn,
                unitType: unitType,
                status: 'IN_STOCK',
                purchase: purchase._id,
                company: purchase.company,
            });
            await newInventory.save();
        }

        // 5. Leftover items in 'matches' remain in 'workingCopy' and will be deleted in the cleanup loop
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
