import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DatabaseConfigService {
    constructor(private readonly configService: ConfigService){}


    get dbHost(): string {
        return this.configService.get<string>('database.host');
    }
    get dbPort(): number {
        return this.configService.get<number>('database.port');
    }
    get dbUsername(): string {
        return this.configService.get<string>('database.username');
    }
    get dbPassword(): string {
        return this.configService.get<string>('database.password');
    }
    get dbName(): string {
        return this.configService.get<string>('database.database');
    }
}