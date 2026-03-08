import { Strategy } from 'passport-jwt';
import { CompanyService } from '../company/company.service';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private companyService;
    private configService;
    constructor(companyService: CompanyService, configService: ConfigService);
    validate(payload: any): Promise<any>;
}
export {};
