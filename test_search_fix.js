const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: String,
    items: [{
        product: mongoose.Schema.Types.Mixed,
        inventory: [mongoose.Schema.Types.Mixed]
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
    
    const matchingProducts = await Product.find({ name: searchRegex }).select('_id').exec();
    console.log("Matching products count:", matchingProducts.length);
    
    const productIds = [
        ...matchingProducts.map(p => p._id.toString()),
        ...matchingProducts.map(p => new mongoose.Types.ObjectId(p._id))
    ];
    
    const filter = {
        'items.product': { $in: productIds }
    };

    try {
        const results = await Invoice.find(filter).exec();
        console.log("Mongoose query match count with fix:", results.length);
    } catch(err) {
        console.error("ERROR:", err);
    }
    process.exit(0);
}
test();
