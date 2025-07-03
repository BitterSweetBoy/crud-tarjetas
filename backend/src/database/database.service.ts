import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {

    private pool: mysql.Pool;

    async onModuleInit() {
        this.pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            database: 'cards',
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10,
            idleTimeout: 60000, 
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
        });
    }

    async onModuleDestroy() {
        if (this.pool) {
            await this.pool.end();
        }
    }

    getPool(): mysql.Pool {
        return this.pool;
    }

    async getConnection(): Promise<mysql.PoolConnection> {
        return this.pool.getConnection();
    }
}