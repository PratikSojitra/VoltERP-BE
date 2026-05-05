const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: String,
    items: [{
        product: mongoose.Schema.Types.ObjectId,
        inventory: [mongoose.Schema.Types.ObjectId]
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
    
    console.log("Searching for productIds[0]:", productIds[0]);

    // Test 1: Simple property path
    const res1 = await Invoice.find({ 'items.product': { $in: productIds } }).exec();
    console.log("Test 1 (items.product $in):", res1.length);

    // Test 2: elemMatch
    const res2 = await Invoice.find({ 
        items: { $elemMatch: { product: { $in: productIds } } } 
    }).exec();
    console.log("Test 2 (elemMatch $in):", res2.length);

    // Test 3: Simple equality on items.product
    const res3 = await Invoice.find({ 'items.product': productIds[0] }).exec();
    console.log("Test 3 (items.product equal):", res3.length);

    // Let's check a specific invoice
    const oneInv = await Invoice.findOne({ 'items.product': { $exists: true } });
    if (oneInv) {
        console.log("Sample Invoice:", oneInv.invoiceNumber);
        console.log("First item product:", oneInv.items[0].product);
        console.log("Type of first item product:", typeof oneInv.items[0].product);
        console.log("Is it instance of ObjectId?", oneInv.items[0].product instanceof mongoose.Types.ObjectId);
    }

    process.exit(0);
}
test();
