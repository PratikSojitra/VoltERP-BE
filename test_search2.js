const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: String,
    status: String,
    items: [{
        product: mongoose.Schema.Types.ObjectId,
    }],
}, { strict: false });

const Invoice = mongoose.model('Invoice', InvoiceSchema);

async function test() {
    await mongoose.connect(process.env.MONGODB_URI);
    
    try {
        const results = await Invoice.find({}).limit(5).exec();
        console.log("Invoices found:", results.length);
        results.forEach(r => {
            console.log("Inv:", r.invoiceNumber, "Products:", r.items.map(i => i.product));
        });
    } catch(err) {
        console.error("ERROR:", err);
    }
    process.exit(0);
}
test();
