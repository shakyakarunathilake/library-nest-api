import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  signUp(
    @Body() { email, name, password }: SignUpDto,
  ): Promise<{ token: string }> {
    console.log('controller signUpDto: ', { email, name, password });
    return this.authService.signUp({ email, name, password });
  }
}
