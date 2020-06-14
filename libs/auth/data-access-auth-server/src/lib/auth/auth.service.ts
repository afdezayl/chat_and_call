import { Injectable } from '@nestjs/common';
import { AuthRepositoryService } from '../auth-repository/auth-repository.service';
import { Observable, from, of } from 'rxjs';
import { compare, hash } from 'bcrypt';
import { catchError, switchMap, map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepositoryService) {}

  async validateUserCredentials(
    username: string,
    password: string
  ): Promise<boolean> {
    const hashedPassword = await this.authRepository.getHashedPassword(
      username
    );
    return await this.checkPassword(password, hashedPassword);
  }

  async createNewUser(
    username: string,
    password: string,
    email: string
  ): Promise<boolean> {
    const hashedPassword = await this.hashPassword(password);
    const isCreated = await this.authRepository.createUser(
      username,
      hashedPassword,
      email
    );
    return isCreated;
  }

  //Private
  private async checkPassword(
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

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, 12);
  }
}
