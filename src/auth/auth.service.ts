import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private companyService: CompanyService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.companyService.findByEmail(email);
        if (user && user.password) {
            const isMatch = await bcrypt.compare(pass, user.password);
            if (isMatch) {
                const { password, ...result } = user.toObject();
                return result;
            }
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        if (!loginDto.password) {
            throw new UnauthorizedException('Password is required');
        }
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { email: user.email, sub: user._id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user,
        };
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string) {
        const user = await this.companyService.findOne(userId);
        
        if (!user.password) {
            throw new UnauthorizedException('User does not have a password set');
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid current password');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.companyService.update(userId, { password: hashedNewPassword } as any);
        return { message: 'Password changed successfully' };
    }
}
