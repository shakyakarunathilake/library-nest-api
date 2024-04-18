import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from './schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModal: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp({
    email,
    name,
    password,
  }: SignUpDto): Promise<{ token: string }> {
    console.log('controller signUpDto: ', { email, name, password });

    const hashedPassword = await hash(password, 10);

    const user = await this.userModal.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }
}
