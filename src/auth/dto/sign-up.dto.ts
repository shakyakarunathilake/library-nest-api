import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty() @IsString() readonly email: string;
  @IsNotEmpty() @IsString() readonly name: string;
  @IsNotEmpty() @IsString() @MinLength(6) readonly password: string;
}
