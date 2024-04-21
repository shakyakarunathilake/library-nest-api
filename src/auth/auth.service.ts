import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { hash, compare } from 'bcryptjs';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from './schemas/user.schema';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { email, name, password } = signUpDto;

    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new BadRequestException('Email already in use.');
    }

    const hashedPassword = await hash(password, 10);

    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });

    try {
      const savedUser = await newUser.save();

      const token = this.jwtService.sign({ id: savedUser._id });

      return { token };
    } catch (error) {
      throw new BadRequestException('Unable to create user.');
    }
  }

  async signIn(signInDto: SignInDto): Promise<{ token: string }> {
    const { email, password } = signInDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user._id });
    return { token };
  }
}
