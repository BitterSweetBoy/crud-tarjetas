import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: mysql.Pool;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const host = this.configService.get<string>('DB_HOST');
    const port = this.configService.get<number>('DB_PORT');
    const user = this.configService.get<string>('DB_USER');
    const pass = this.configService.get<string>('DB_PASSWORD');
    const db = this.configService.get<string>('DB_NAME');
    this.pool = mysql.createPool({
      host,
      port,
      user,
      password: pass,
      database: db,
      waitForConnections: true,
      connectionLimit: this.configService.get<number>('DB_CONN_LIMIT', 10),
      maxIdle: this.configService.get<number>('DB_MAX_IDLE', 10),
      idleTimeout: this.configService.get<number>('DB_IDLE_TIMEOUT', 60000),
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
