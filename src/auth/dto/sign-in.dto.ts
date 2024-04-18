import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class signInDto {
  @IsNotEmpty() @IsString() readonly email: string;
  @IsNotEmpty() @IsString() @MinLength(6) readonly password: string;
}
