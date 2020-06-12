import { Injectable, Logger } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';

@Injectable()
export class DatabasePoolService {
  public readonly pool: Pool;

  constructor() {
    const dbConnector = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_TABLE,
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
