import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepositoryService } from '../auth-repository/auth-repository.service';
import { Observable, from, of } from 'rxjs';
import { compare, hash } from 'bcrypt';
import { catchError, switchMap, map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepositoryService,
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

  async getTokens(username: string): Promise<{ jwt: string; refresh: string }> {
    const jwt = await this.jwtService.signAsync({username});
    const refresh = await this.jwtService.signAsync({username}, {expiresIn: '24h'});

    return {
      jwt,
      refresh
    };
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

  //Private
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
