const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://Pratik:Joker%4077@volderp.75ypek5.mongodb.net/?appName=voldERP";

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const result = await mongoose.connection.collection('purchases').updateMany(
            {},
            { $set: { status: 'COMPLETED' } }
        );
        console.log(`Updated ${result.modifiedCount} purchase records to COMPLETED`);
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}
run();
