const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();

const PaymentSchema = new mongoose.Schema({
    invoice: mongoose.Schema.Types.ObjectId,
    purchase: mongoose.Schema.Types.ObjectId,
    customer: mongoose.Schema.Types.ObjectId,
    vendor: mongoose.Schema.Types.ObjectId,
    company: mongoose.Schema.Types.ObjectId,
    amount: Number,
    paymentDate: Date,
    paymentMethod: String,
    status: String,
    type: String,
    referenceNumber: String,
    notes: String,
    history: Array,
    createdAt: Date
}, { strict: false });

const InvoiceSchema = new mongoose.Schema({
    grandTotal: Number,
    paidAmount: Number,
    outstandingAmount: Number,
    status: String
}, { strict: false });

const PurchaseSchema = new mongoose.Schema({
    grandTotal: Number,
    paidAmount: Number,
    outstandingAmount: Number,
    status: String
}, { strict: false });

const Payment = mongoose.model('Payment', PaymentSchema);
const Invoice = mongoose.model('Invoice', InvoiceSchema);
const Purchase = mongoose.model('Purchase', PurchaseSchema);

async function migrate() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    // Group all payments by invoice
    const allPayments = await Payment.find().sort({ createdAt: 1 });
    
    const invoicePayments = {};
    const purchasePayments = {};

    for (let p of allPayments) {
        if (p.invoice) {
            let id = p.invoice.toString();
            if (!invoicePayments[id]) invoicePayments[id] = [];
            invoicePayments[id].push(p);
        } else if (p.purchase) {
            let id = p.purchase.toString();
            if (!purchasePayments[id]) purchasePayments[id] = [];
            purchasePayments[id].push(p);
        }
    }

    // Migrate Invoice Payments
    for (const [invoiceId, payments] of Object.entries(invoicePayments)) {
        let basePayment = payments[0];
        let totalPaid = 0;
        
        // Always reset history to make sure we parse properly
        basePayment.history = [];

        for (let p of payments) {
            if (p.status !== 'PENDING' && p.amount > 0) {
                // For old single documents that might already have history from testing
                if (p.history && p.history.length > 0 && p._id.toString() === basePayment._id.toString()) {
                    basePayment.history = p.history;
                    totalPaid = p.amount;
                } else {
                    basePayment.history.push({
                        amount: p.amount,
                        paymentDate: p.paymentDate || new Date(),
                        paymentMethod: p.paymentMethod || 'OTHER',
                        referenceNumber: p.referenceNumber,
                        notes: p.notes
                    });
                    totalPaid += p.amount;
                }
                
                basePayment.paymentDate = p.paymentDate;
                basePayment.paymentMethod = p.paymentMethod;
                basePayment.referenceNumber = p.referenceNumber;
                basePayment.notes = p.notes;
            }
        }

        basePayment.amount = totalPaid;
        
        const invoice = await Invoice.findById(invoiceId);
        const grandTotal = invoice ? invoice.grandTotal : 0;

        if (grandTotal > 0) {
            if (totalPaid === 0) basePayment.status = 'PENDING';
            else if (totalPaid < grandTotal) basePayment.status = 'PARTIAL';
            else basePayment.status = 'COMPLETED';
        } else {
            basePayment.status = 'COMPLETED';
        }

        // Sync Invoice
        if (invoice) {
            const outstanding = grandTotal - totalPaid;
            invoice.paidAmount = totalPaid;
            invoice.outstandingAmount = outstanding > 0 ? outstanding : 0;
            if (invoice.outstandingAmount <= 0) invoice.status = 'PAID';
            else if (totalPaid > 0) invoice.status = 'PARTIAL';
            else invoice.status = 'UNPAID';
            await invoice.save();
        }

        await basePayment.save();

        const toDeleteIds = payments.slice(1).map(p => p._id);
        if (toDeleteIds.length > 0) {
            await Payment.deleteMany({ _id: { $in: toDeleteIds } });
            console.log(`Consolidated ${payments.length} payments into 1 for invoice ${invoiceId}`);
        } else {
            console.log(`Updated 1 payment document for invoice ${invoiceId}`);
        }
    }

    // Migrate Purchase Payments
    for (const [purchaseId, payments] of Object.entries(purchasePayments)) {
        let basePayment = payments[0];
        let totalPaid = 0;
        basePayment.history = [];

        for (let p of payments) {
            if (p.status !== 'PENDING' && p.amount > 0) {
                if (p.history && p.history.length > 0 && p._id.toString() === basePayment._id.toString()) {
                    basePayment.history = p.history;
                    totalPaid = p.amount;
                } else {
                    basePayment.history.push({
                        amount: p.amount,
                        paymentDate: p.paymentDate || new Date(),
                        paymentMethod: p.paymentMethod || 'OTHER',
                        referenceNumber: p.referenceNumber,
                        notes: p.notes
                    });
                    totalPaid += p.amount;
                }
                
                basePayment.paymentDate = p.paymentDate;
                basePayment.paymentMethod = p.paymentMethod;
                basePayment.referenceNumber = p.referenceNumber;
                basePayment.notes = p.notes;
            }
        }

        basePayment.amount = totalPaid;
        
        const purchase = await Purchase.findById(purchaseId);
        const grandTotal = purchase ? purchase.grandTotal : 0;

        if (grandTotal > 0) {
            if (totalPaid === 0) basePayment.status = 'PENDING';
            else if (totalPaid < grandTotal) basePayment.status = 'PARTIAL';
            else basePayment.status = 'COMPLETED';
        } else {
            basePayment.status = 'COMPLETED';
        }

        if (purchase) {
            const outstanding = grandTotal - totalPaid;
            purchase.paidAmount = totalPaid;
            purchase.outstandingAmount = outstanding > 0 ? outstanding : 0;
            await purchase.save();
        }

        await basePayment.save();

        const toDeleteIds = payments.slice(1).map(p => p._id);
        if (toDeleteIds.length > 0) {
            await Payment.deleteMany({ _id: { $in: toDeleteIds } });
            console.log(`Consolidated ${payments.length} payments into 1 for purchase ${purchaseId}`);
        } else {
            console.log(`Updated 1 payment document for purchase ${purchaseId}`);
        }
    }

    console.log("Migration complete.");
    process.exit(0);
}

migrate().catch(console.error);
