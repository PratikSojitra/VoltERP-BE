import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { ConfigService } from '@nestjs/config'; // We will use ConfigService or directly a string

// Note: Ensure ConfigModule is used or define a constant for secret.

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private companyService: CompanyService,
        private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET')!,
        });
    }

    async validate(payload: any) {
        const user = await this.companyService.findByEmail(payload.email);
        if (!user) {
            throw new UnauthorizedException();
        }
        // Return a plain object with userId to match controller expectations
        return {
            ...user.toObject(),
            userId: user._id.toString(),
        };
    }
}
