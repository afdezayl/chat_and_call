import { Injectable, Logger } from '@nestjs/common';
import { DatabasePoolService } from '@chat-and-call/utils/database-pool';

@Injectable()
export class AuthRepositoryService {
  constructor(private db: DatabasePoolService, private logger: Logger) {
    this.logger.setContext(this.constructor.name);
  }

  async getHashedPassword(username: string): Promise<string> {
    try {
      const [
        rows,
      ] = await this.db.pool.execute(
        'select password from users where login = ?',
        [username]
      );
      return rows[0]?.password ?? null;
    } catch (error) {
      this.logger.error(error);
    }
    return null;
  }

  async createUser(
    username: string,
    hashedPassword: string,
    email: string
  ): Promise<boolean> {
    try {
      await this.db.pool.execute(
        `INSERT INTO users
          (login, password, mail)
          values (?,?,?)`,
        [username, hashedPassword, email]
      );
      return true;
    } catch (error) {
      this.logger.error(error);
    }
    return false;
  }
}
