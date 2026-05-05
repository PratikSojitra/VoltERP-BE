const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();

async function test() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const collection = db.collection('invoices');
    
    const doc = await collection.findOne({});
    console.log("Raw Invoice:", JSON.stringify(doc, null, 2));
    
    const productId = doc.items[0].product;
    console.log("Product ID type:", typeof productId);
    console.log("Product ID:", productId);

    const match = await collection.findOne({ 'items.product': productId });
    console.log("Match found with raw query?", !!match);

    process.exit(0);
}
test();
