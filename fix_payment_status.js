const mongoose = require('mongoose');
const dns = require('node:dns');

// Fix DNS resolution for MongoDB Atlas
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const MONGODB_URI = "mongodb+srv://Pratik:Joker%4077@volderp.75ypek5.mongodb.net/?appName=voldERP";

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const paymentsCollection = mongoose.connection.collection('payments');
        const invoicesCollection = mongoose.connection.collection('invoices');
        const purchasesCollection = mongoose.connection.collection('purchases');

        const payments = await paymentsCollection.find({}).toArray();
        let updatedCount = 0;

        console.log(`Found ${payments.length} total payments. Checking and fixing statuses...`);

        for (const payment of payments) {
            let newStatus = payment.status;
            let outstanding = 0;
            let grandTotal = 0;

            if (payment.invoice) {
                const invoice = await invoicesCollection.findOne({ _id: payment.invoice });
                if (invoice) {
                    outstanding = invoice.outstandingAmount || 0;
                    grandTotal = invoice.grandTotal || 0;
                }
            } else if (payment.purchase) {
                const purchase = await purchasesCollection.findOne({ _id: payment.purchase });
                if (purchase) {
                    outstanding = purchase.outstandingAmount || 0;
                    grandTotal = purchase.grandTotal || 0;
                }
            }

            if (outstanding === grandTotal && grandTotal > 0) {
                newStatus = 'PENDING';
            } else if (outstanding > 0) {
                newStatus = 'PARTIAL';
            } else if (outstanding === 0 && grandTotal > 0) {
                newStatus = 'COMPLETED';
            }

            if (newStatus !== payment.status) {
                await paymentsCollection.updateOne(
                    { _id: payment._id },
                    { $set: { status: newStatus } }
                );
                updatedCount++;
                console.log(`Updated Payment ID: ${payment._id} from ${payment.status} to ${newStatus} (Outstanding: ${outstanding}/${grandTotal})`);
            }
        }

        console.log(`\nMigration completed. Updated ${updatedCount} payments.`);
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

run();
