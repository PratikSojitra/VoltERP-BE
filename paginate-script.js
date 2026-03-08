const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const modules = ['customer', 'product', 'invoice', 'company', 'inventory', 'payment'];

modules.forEach(mod => {
    const controllerPath = path.join(srcDir, mod, `${mod}.controller.ts`);
    const servicePath = path.join(srcDir, mod, `${mod}.service.ts`);

    // Update Controller
    if (fs.existsSync(controllerPath)) {
        let text = fs.readFileSync(controllerPath, 'utf8');

        if (!text.includes('Query,')) {
            text = text.replace(/import\s+{([^}]+)}\s+from\s+'@nestjs\/common';/, (match, p1) => {
                return `import { Query, ${p1.trim()} } from '@nestjs/common';`;
            });
        }

        const oldFindAllRegex = /@Get\(\)\s+@UseGuards\(JwtAuthGuard\)\s+findAll\(@Req\(\) req: any\) \{[\s\S]*?\n    \}/g;

        let newFindAllStr = '';
        if (mod === 'company') {
            newFindAllStr = `@Get()
    @UseGuards(JwtAuthGuard)
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 10;
        return this.companyService.findAll(pageNumber, limitNumber);
    }`;
            // check if company has @Req() in findAll
            const companyRegex = /@Get\(\)\s+@UseGuards\(JwtAuthGuard\)\s+findAll\(\) \{[\s\S]*?\n    \}/g;
            text = text.replace(companyRegex, newFindAllStr);
        } else {
            newFindAllStr = `@Get()
    @UseGuards(JwtAuthGuard)
    findAll(
        @Req() req: any,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 10;
        
        if (req.user.role === Role.COMPANY) {
            return this.${mod}Service.findAll(req.user.userId, pageNumber, limitNumber);
        }
        return this.${mod}Service.findAll(undefined, pageNumber, limitNumber);
    }`;
            text = text.replace(oldFindAllRegex, newFindAllStr);
        }

        // Let's print changes
        fs.writeFileSync(controllerPath, text);
        console.log(`Updated ${controllerPath}`);
    }

    // Update Service
    if (fs.existsSync(servicePath)) {
        let text = fs.readFileSync(servicePath, 'utf8');

        if (mod === 'company') {
            const oldServiceFindAll = /async findAll\(\): Promise<[A-Za-z]+\[\]> \{\s+return this\.[A-Za-z]+Model\.find\(\)\.exec\(\);\s+\}/;
            const newServiceFindAll = `async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.companyModel.find().skip(skip).limit(limit).exec(),
            this.companyModel.countDocuments().exec()
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }`;
            text = text.replace(oldServiceFindAll, newServiceFindAll);
            // Replace Return type in findOne if any but nvm
        } else {
            const oldServiceFindAllRegex = new RegExp(`async findAll\\(companyId\\?: string\\): Promise<${mod.charAt(0).toUpperCase() + mod.slice(1)}\\[\\]> \\{[\\s\\S]*?return this\\.[a-zA-Z]+Model\\.find\\(filter\\)\\.populate\\('company'\\)\\.exec\\(\\);\\s+\\}`);
            const newServiceFindAllStr = `async findAll(companyId?: string, page: number = 1, limit: number = 10) {
        const filter = companyId ? { company: companyId } : {};
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.${mod}Model.find(filter).skip(skip).limit(limit).populate('company').exec(),
            this.${mod}Model.countDocuments(filter).exec()
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }`;
            text = text.replace(oldServiceFindAllRegex, newServiceFindAllStr);

            // wait, some modules populate 'product' or 'invoice', let's just make it generic populate options by looking at original
            const populateRegex = /\.populate\('([^']+)'\)/g;
            let populates = [];
            let match;
            // Let's use a dynamic replace without assuming '.populate('company')' only.
        }
    }
});
