const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
require('dotenv').config();

async function test() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    
    const product = await db.collection('products').findOne({});
    console.log("Raw Product:", JSON.stringify(product, null, 2));
    console.log("Type of Product _id:", typeof product._id);

    process.exit(0);
}
test();
