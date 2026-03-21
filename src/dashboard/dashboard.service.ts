import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Company } from '../company/schemas/company.schema';
import { Customer } from '../customer/schemas/customer.schema';
import { Inventory } from '../inventory/schemas/inventory.schema';
import { Invoice } from '../invoice/schemas/invoice.schema';
import { Product } from '../product/schemas/product.schema';

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(Company.name) private readonly companyModel: Model<Company>,
        @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
        @InjectModel(Inventory.name) private readonly inventoryModel: Model<Inventory>,
        @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>
    ) {}

    async getAdminStats() {
        const [customers, companies, inventory, invoices] = await Promise.all([
            this.customerModel.countDocuments(),
            this.companyModel.countDocuments(),
            this.inventoryModel.countDocuments({ status: { $ne: 'SOLD' } }),
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

    async getCompanyStats(companyId: string) {
        const [customers, invoices, inventory] = await Promise.all([
            this.customerModel.countDocuments({ company: companyId }),
            this.invoiceModel.find({ company: companyId }).select('grandTotal').lean(),
            this.inventoryModel.countDocuments({ company: companyId, status: { $ne: 'SOLD' } })
        ]);

        const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

        const recentSales = await this.invoiceModel
            .find({ company: companyId })
            .sort({ issueDate: -1, createdAt: -1 })
            .limit(5)
            .populate('customer', 'name email address')
            .lean();

        // Count invoices as "entities" to reuse the dashboard slot instead of "companies"
        const totalInvoicesGen = invoices.length;

        return {
            revenue: totalRevenue,
            users: customers,
            entities: totalInvoicesGen,
            inventoryItems: inventory,
            recentSales,
            entityType: 'Total Sales'
        };
    }
}
