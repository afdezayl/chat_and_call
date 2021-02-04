import { ChannelsDataAccessService } from '@chat-and-call/channels/data-access-server';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthRepositoryService } from '../auth-repository/auth-repository.service';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepositoryService,
    private channelService: ChannelsDataAccessService,
    private jwtService: JwtService
  ) {}

  async validateUserCredentials(
    username: string,
    password: string
  ): Promise<boolean> {
    const hashedPassword = await this.authRepository.getHashedPassword(
      username
    );
    return await this._checkPassword(password, hashedPassword);
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

  async createNewUser(
    username: string,
    password: string,
    email: string
  ): Promise<boolean> {
    const hashedPassword = await this._hashPassword(password);
    const isCreated = await this.authRepository.createUser(
      username,
      hashedPassword,
      email
    );
    return isCreated;
  }

  async isUser(username: string) {
    return await this.authRepository.isUser(username);
  }

  private async _checkPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      const isValid = await compare(password, hashedPassword);
      return isValid;
    } catch (error) {
      return false;
    }
  }

  private async _hashPassword(password: string): Promise<string> {
    return await hash(password, 12);
  }
}
