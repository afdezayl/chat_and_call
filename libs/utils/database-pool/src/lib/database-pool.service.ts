import { Injectable, Logger } from '@nestjs/common';
import { createPool, Pool, PoolOptions } from 'mysql2/promise';

@Injectable()
export class DatabasePoolService {
  public readonly pool: Pool;

  constructor() {
    const dbConnector: PoolOptions = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
    };

    this.pool = createPool({
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ...dbConnector,
    });
    Logger.log('Created database pool', this.constructor.name);
  }
}
