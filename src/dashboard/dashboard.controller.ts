import {
    Controller,
    Get,
    UseGuards,
    Req,
    Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { Role } from '../company/schemas/company.schema';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('stats')
    async getStats(@Req() req: any, @Query('period') period?: string) {
        if (req.user.role === Role.COMPANY) {
            return this.dashboardService.getCompanyStats(req.user.userId, period);
        } else {
            return this.dashboardService.getAdminStats();
        }
    }
}
