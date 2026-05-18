import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '@prisma/client';
import { SkipIfBlank } from '../../../decorators/skip-if-blank.decorator';
import { TransformDirtyBlank } from '../../../decorators/transform-dirty-blank.decorator';

export class BaseUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Whether the email has been verified',
    example: true,
  })
  @IsBoolean()
  @Expose()
  emailVerified: boolean;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  @TransformDirtyBlank()
  @Expose()
  name?: string | null;

  @ApiProperty({
    description: 'URL to the user avatar image',
    required: false,
  })
  @IsOptional()
  @SkipIfBlank()
  @IsString()
  @Expose()
  image?: string | null;

  @ApiProperty({
    description: 'User role in the system',
    enum: Role,
    example: Role.ADMIN,
  })
  @IsEnum(Role)
  @Expose()
  role: Role;
}
