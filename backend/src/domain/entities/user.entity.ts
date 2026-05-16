import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseAggregateRootEntity } from '../../config/entities/base-entities/blacklist-strategy/base.entity';
import { BaseEntityType } from '../../config/entities/base-entities/base-entity.types';
import { Role } from '@prisma/client';
import { SkipIfBlank } from '../../presentation/decorators/skip-if-blank.decorator';
import { TransformDirtyBlank } from '../../presentation/decorators/transform-dirty-blank.decorator';

export interface UserType extends BaseEntityType {
  email: string;
  emailVerified: boolean;
  name?: string | null;
  image?: string | null;
  role: Role;
}

export class UserEntity
  extends BaseAggregateRootEntity<UserEntity>
  implements UserType
{
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Whether the email has been verified',
    example: true,
  })
  @IsBoolean()
  emailVerified: boolean;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  @TransformDirtyBlank()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name?: string | null;

  @ApiProperty({
    description: 'URL to the user avatar image',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string | null;

  @ApiProperty({
    description: 'User role in the system',
    enum: Role,
    example: Role.ADMIN,
  })
  @IsEnum(Role)
  role: Role;

  // We can exclude sensitive internal fields or mapping relations if any.

  constructor(partial: Partial<UserType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
