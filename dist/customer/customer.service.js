"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const customer_schema_1 = require("./schemas/customer.schema");
let CustomerService = class CustomerService {
    customerModel;
    constructor(customerModel) {
        this.customerModel = customerModel;
    }
    async create(createCustomerDto) {
        const createdCustomer = new this.customerModel(createCustomerDto);
        return createdCustomer.save();
    }
    async findAll(companyId, page = 1, limit = 10) {
        const filter = companyId ? { company: companyId } : {};
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.customerModel.find(filter).skip(skip).limit(limit).populate('company').exec(),
            this.customerModel.countDocuments(filter).exec()
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const customer = await this.customerModel.findById(id).populate('company').exec();
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID "${id}" not found`);
        }
        return customer;
    }
    async update(id, updateCustomerDto) {
        const existingCustomer = await this.customerModel
            .findByIdAndUpdate(id, updateCustomerDto, { new: true })
            .exec();
        if (!existingCustomer) {
            throw new common_1.NotFoundException(`Customer with ID "${id}" not found`);
        }
        return existingCustomer;
    }
    async remove(id) {
        const deletedCustomer = await this.customerModel.findByIdAndDelete(id).exec();
        if (!deletedCustomer) {
            throw new common_1.NotFoundException(`Customer with ID "${id}" not found`);
        }
        return deletedCustomer;
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(customer_schema_1.Customer.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CustomerService);
//# sourceMappingURL=customer.service.js.map