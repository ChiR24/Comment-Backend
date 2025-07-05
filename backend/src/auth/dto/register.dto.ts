import { IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(4)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
} 