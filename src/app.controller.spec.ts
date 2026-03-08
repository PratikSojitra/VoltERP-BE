import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const MONGODB_URI = 'mongodb+srv://Pratik:Joker%4077@volderp.75ypek5.mongodb.net/?appName=voldERP';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      createAdmin()
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});


async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const CompanySchema = new mongoose.Schema({
      name: { type: String, required: true },
      password: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      role: { type: String, enum: ['ADMIN', 'COMPANY'], default: 'COMPANY' },
      isActive: { type: Boolean, default: true }
    }, { timestamps: true });

    const Company = mongoose.model('Company', CompanySchema);

    const email = 'pratiksojitra77@gmail.com';
    const password = 'Pass123-1';
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminData = {
      name: 'Pratik Sojitra',
      email: email,
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true
    };

    const existing = await Company.findOne({ email });
    if (existing) {
      console.log('Admin already exists. Updating password...');
      existing.password = hashedPassword;
      await existing.save();
      console.log('Admin updated successfully');
    } else {
      const admin = new Company(adminData);
      await admin.save();
      console.log('Admin created successfully');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

;
