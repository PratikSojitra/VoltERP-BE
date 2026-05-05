const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: String,
    status: String,
    customer: mongoose.Schema.Types.ObjectId,
    items: [{
        product: mongoose.Schema.Types.ObjectId,
        inventory: [mongoose.Schema.Types.ObjectId]
    }],
    company: mongoose.Schema.Types.ObjectId
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
    
    const matchingProducts = await Product.find({ name: searchRegex }).select('_id').exec();
    console.log("Matching products:", matchingProducts.length);
    const productIds = matchingProducts.map(p => p._id);
    
    const filter = {};
    filter.$or = [
        { invoiceNumber: searchRegex },
        { status: searchRegex },
        { customer: { $in: [] } },
        { 'items.product': { $in: productIds } },
        { 'items.inventory': { $in: [] } }
    ];

    try {
        const results = await Invoice.find(filter).limit(10).exec();
        console.log("Found", results.length, "results");
        console.log(JSON.stringify(results.map(r => r.invoiceNumber)));
    } catch(err) {
        console.error("ERROR:", err);
    }
    process.exit(0);
}
test();
