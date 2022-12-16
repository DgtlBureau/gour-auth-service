import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { generate as generatePassword, GenerateOptions } from 'generate-password';

@Injectable()
export class PasswordService {
  SALT = 5;

  generate(options?: GenerateOptions) {
    return generatePassword(options);
  }

  hash(pass: string) {
    return bcrypt.hash(pass, this.SALT);
  }

  compare(pass: string, encrypted: string) {
    return bcrypt.compare(pass, encrypted);
  }
}
