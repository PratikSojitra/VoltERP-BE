import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Company } from '../company/schemas/company.schema';
import { Customer } from '../customer/schemas/customer.schema';
import { Inventory } from '../inventory/schemas/inventory.schema';
import { Invoice } from '../invoice/schemas/invoice.schema';
import { Product } from '../product/schemas/product.schema';
import { Purchase } from '../purchase/schemas/purchase.schema';
import { Payment } from '../payment/schemas/payment.schema';

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(Company.name) private readonly companyModel: Model<Company>,
        @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
        @InjectModel(Inventory.name) private readonly inventoryModel: Model<Inventory>,
        @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
        @InjectModel(Product.name) private readonly productModel: Model<Product>,
        @InjectModel(Purchase.name) private readonly purchaseModel: Model<Purchase>,
        @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    ) { }

    async getAdminStats() {
        const [customers, companies, inventory, invoices] = await Promise.all([
            this.customerModel.countDocuments(),
            this.companyModel.countDocuments(),
            this.inventoryModel.countDocuments({ status: { $ne: 'SOLD' }, unitType: { $ne: 'Outdoor Unit (ODU)' } }),
            this.invoiceModel.find().select('grandTotal').lean()
        ]);

        const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

        const recentSales = await this.invoiceModel
            .find()
            .sort({ issueDate: -1, createdAt: -1 })
            .limit(5)
            .populate('customer', 'name email address')
            .lean();

        return {
            revenue: totalRevenue,
            users: customers,
            entities: companies,
            inventoryItems: inventory,
            recentSales,
            entityType: 'Companies'
        };
    }

    async getCompanyStats(companyId: string, period: string = 'historical') {
        const filter: any = { company: companyId };
        const customerFilter: any = { company: companyId };
        
        // Date boundaries for "Real-time" (Current Month)
        if (period === 'realtime') {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            filter.createdAt = { $gte: startOfMonth }; // default for some
            // Overrides for model specific dates will be handled in specific queries
        }

        const invoiceFilter = { ...filter };
        const purchaseFilter = { ...filter };
        const paymentFilter = { ...filter, status: 'COMPLETED' };

        if (period === 'realtime') {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            
            // Invoices use issueDate
            delete invoiceFilter.createdAt;
            invoiceFilter.issueDate = { $gte: startOfMonth };
            
            // Purchases use purchaseDate
            delete purchaseFilter.createdAt;
            purchaseFilter.purchaseDate = { $gte: startOfMonth };

            // Payments use paymentDate
            delete paymentFilter.createdAt;
            paymentFilter.paymentDate = { $gte: startOfMonth };

            // Customers: usually we count all customers, but if real-time means "New" customers this month:
            // customerFilter.createdAt = { $gte: startOfMonth };
            // Let's keep total customers for now as it's a vital stat, or maybe new ones?
            // Users usually want to see total active customers.
        }

        const [customersCount, invoiceData, inventoryCount, purchaseData, paymentsReport] = await Promise.all([
            this.customerModel.countDocuments(customerFilter),
            this.invoiceModel.find(invoiceFilter).select('grandTotal outstandingAmount status').lean(),
            this.inventoryModel.countDocuments({ company: companyId, status: 'IN_STOCK', unitType: { $ne: 'Outdoor Unit (ODU)' } }),
            this.purchaseModel.find(purchaseFilter).select('grandTotal outstandingAmount status').lean(),
            this.paymentModel.aggregate([
                { $match: { 
                    company: new Types.ObjectId(companyId), 
                    status: 'COMPLETED',
                    ...(period === 'realtime' ? { paymentDate: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } : {})
                } },
                { $group: { _id: "$type", total: { $sum: "$amount" } } }
            ])
        ]);

        // Monthly trends (Always show last 6 months for the chart regardless of toggle, or maybe it adds context)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const [monthlySales, monthlyPurchases] = await Promise.all([
            this.invoiceModel.aggregate([
                { $match: { company: new Types.ObjectId(companyId), issueDate: { $gte: sixMonthsAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$issueDate" } },
                        total: { $sum: "$grandTotal" }
                    }
                },
                { $sort: { "_id": 1 } }
            ]),
            this.purchaseModel.aggregate([
                { $match: { company: new Types.ObjectId(companyId), purchaseDate: { $gte: sixMonthsAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$purchaseDate" } },
                        total: { $sum: "$grandTotal" }
                    }
                },
                { $sort: { "_id": 1 } }
            ])
        ]);

        // Top Selling Products (Filtered by period if real-time)
        const topProductsRaw = await this.invoiceModel.aggregate([
            { $match: { 
                company: new Types.ObjectId(companyId),
                ...(period === 'realtime' ? { issueDate: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } : {})
            } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    quantity: { $sum: "$items.quantity" },
                    revenue: { $sum: "$items.totalPrice" }
                }
            },
            { $sort: { quantity: -1 } },
            { $limit: 5 }
        ]);

        const populatedTopProducts = await this.productModel.populate(topProductsRaw, { path: '_id', select: 'name type' });

        const totalRevenue = invoiceData.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
        const totalPurchases = purchaseData.reduce((sum, p) => sum + (p.grandTotal || 0), 0);
        const outstandingReceivables = invoiceData.reduce((sum, inv) => sum + (inv.outstandingAmount || 0), 0);
        const outstandingPayables = purchaseData.reduce((sum, p) => sum + (p.outstandingAmount || 0), 0);

        const salesPayment = paymentsReport.find(p => p._id === 'SALES')?.total || 0;
        const purchasePayment = paymentsReport.find(p => p._id === 'PURCHASE')?.total || 0;

        const recentSales = await this.invoiceModel
            .find({ company: companyId })
            .sort({ issueDate: -1, createdAt: -1 })
            .limit(5)
            .populate('customer', 'name email')
            .lean();

        return {
            revenue: totalRevenue,
            users: customersCount,
            inventoryItems: inventoryCount,
            recentSales,
            
            // New Extended Analytics
            totalPurchases,
            outstandingReceivables,
            outstandingPayables,
            totalSalesCollected: salesPayment,
            totalPurchasePaid: purchasePayment,
            
            monthlyTrends: {
                labels: monthlySales.map(m => m._id),
                sales: monthlySales.map(m => m.total),
                purchases: monthlyPurchases.map(m => m.total)
            },
            topProducts: populatedTopProducts.map((p: any) => ({
                name: p._id?.name || 'Unknown',
                quantity: p.quantity,
                revenue: p.revenue
            })),
            
            entityType: 'Sales Count',
            entities: invoiceData.length,
        };
    }
}
