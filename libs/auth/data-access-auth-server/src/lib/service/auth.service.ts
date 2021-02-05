import { ChannelsDataAccessService } from '@chat-and-call/channels/data-access-server';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '@chat-and-call/database/entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private channelService: ChannelsDataAccessService,
    private jwtService: JwtService,
    private logger: Logger
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

  getTokenContent(username: string) {
    return from(this.channelService.getChannels(username)).pipe(
      map((channels) => channels.map((ch) => ch.id)),
      map((channels) => ({ username, channels }))
    );
  }

  async getTokens(username: string): Promise<{ jwt: string; refresh: string }> {
    const channels = (await this.channelService.getChannels(username)).map(
      (ch) => ch.id
    );

    const jwt = await this.jwtService.signAsync({ username, channels });
    const refresh = await this.jwtService.signAsync(
      { username },
      { expiresIn: '24h' }
    );

    return {
      jwt,
      refresh,
    };
  }

  validateToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }

  // TODO: Success, Already registered , Internal Error
  async createNewUser(
    username: string,
    password: string,
    email: string
  ): Promise<boolean> {
    try {
      const hashedPassword = await this._hashPassword(password);
      const user = this.userRepository.create({
        login: username,
        mail: email,
        password: hashedPassword,
      });

      await this.userRepository.persistAndFlush(user);
      return true;
    } catch (error) {
      const isEmailTaken =
        (await this.userRepository.count({ mail: email })) > 0;
      const isUsernameTaken =
        (await this.userRepository.count({ login: username })) > 0;

      console.log({ isEmailTaken, isUsernameTaken });

      if (isEmailTaken || isUsernameTaken) {
        return false;
      } else {
        this.logger.error(error);
      }
      return false;
    }
  }

  async isUser(username: string) {
    const isUser = (await this.userRepository.count({ login: username })) > 0;

    return isUser;
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
