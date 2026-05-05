const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: String,
    items: [{
        product: mongoose.Schema.Types.ObjectId,
    }],
}, { strict: false });

const ProductSchema = new mongoose.Schema({
    name: String
}, { strict: false });

const Invoice = mongoose.model('Invoice', InvoiceSchema);
const Product = mongoose.model('Product', ProductSchema);

async function test() {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const search = 'AC';
    const searchRegex = { $regex: search, $options: 'i' };
    
    const matchingProducts = await Product.find({ name: searchRegex }).select('_id name').exec();
    console.log("Matching products count:", matchingProducts.length);
    const productIds = matchingProducts.map(p => p._id);
    
    const allInvoices = await Invoice.find({}).exec();
    console.log("Total invoices:", allInvoices.length);

    let matchCount = 0;
    allInvoices.forEach(inv => {
        const invProductIds = inv.items.map(i => i.product?.toString());
        const matches = productIds.filter(id => invProductIds.includes(id.toString()));
        if (matches.length > 0) {
            matchCount++;
            console.log(`Invoice ${inv.invoiceNumber} matches with products:`, matches.map(id => matchingProducts.find(p => p._id.toString() === id.toString())?.name));
        }
    });

    console.log("Manual match count:", matchCount);

    const filter = {
        'items.product': { $in: productIds }
    };
    const queryResults = await Invoice.find(filter).exec();
    console.log("Mongoose query match count:", queryResults.length);

    process.exit(0);
}
test();
