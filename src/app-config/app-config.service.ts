import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {

    private readonly _connectionString!: string;

    get connectionString(): string {
        return this._connectionString;
    }

    constructor(private readonly _configService: ConfigService) {
        this._connectionString = this._getConnectionStringFromEnvFile();
    }

    private _getConnectionStringFromEnvFile(): string {
        const host = this._configService.get<string>('DB_HOST');
        const port = this._configService.get<string>('DB_PORT');
        const database = this._configService.get<string>('DB_NAME');

        return `mongodb://${host}:${port}/${database}`;
    }
}
