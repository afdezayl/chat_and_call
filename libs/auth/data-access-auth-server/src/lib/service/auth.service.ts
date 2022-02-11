import { User } from '@chat-and-call/database/entities';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, ConsoleLogger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

export class Success {}
export class Fail {}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private jwtService: JwtService,
    private logger: ConsoleLogger
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async validateUserCredentials(
    username: string,
    password: string
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({ login: username });
    if (!user) {
      return false;
    }
    return await this._checkPassword(password, user.password);
  }

  async getTokens(username: string): Promise<{ jwt: string; refresh: string }> {
    const jwt = await this.jwtService.signAsync({ username });
    const refresh = await this.jwtService.signAsync(
      { username },
      { expiresIn: '24h' }
    );

    return {
      jwt,
      refresh,
    };
  }

  async validateToken(token: string) {
    try {
      return await this.jwtService.verifyAsync<{ username: string }>(token);
    } catch (error) {}
    return null;
  }

  // TODO: Success, Already registered , Internal Error
  async createNewUser(
    username: string,
    password: string,
    email: string
  ): Promise<
    Success | { isEmailTaken: boolean; isUsernameTaken: boolean } | Fail
  > {
    try {
      const hashedPassword = await this._hashPassword(password);
      const user = this.userRepository.create({
        login: username,
        mail: email,
        password: hashedPassword,
      });

      await this.userRepository.persistAndFlush(user);
      return new Success();
    } catch (error) {
      const isEmailTaken = await this.isEmailTaken(email);
      const isUsernameTaken = await this.isUsernameTaken(username);

      if (isEmailTaken || isUsernameTaken) {
        return { isEmailTaken, isUsernameTaken };
      }

      //TODO: return internal error
      this.logger.error(error);
      return new Fail();
    }
  }

  async isUsernameTaken(username: string) {
    return (await this.userRepository.count({ login: username })) > 0;
  }

  async isEmailTaken(email: string) {
    return (await this.userRepository.count({ mail: email })) > 0;
  }

  private async _checkPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  private async _hashPassword(password: string): Promise<string> {
    return await hash(password, 12);
  }
}
