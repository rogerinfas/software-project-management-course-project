import { ApiProperty, OmitType } from '@nestjs/swagger';
import { BaseUserDto } from './base-user.dto';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserRequest extends OmitType(BaseUserDto, [
  'emailVerified',
] as const) {
  @ApiProperty({
    description: 'User password',
    example: 'StrongPass123!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
