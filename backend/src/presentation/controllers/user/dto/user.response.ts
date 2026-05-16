import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseUserDto } from './base-user.dto';

export class UserResponse extends BaseUserDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Indicates whether the user is active',
    example: true,
  })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    description: 'Creation date',
    example: new Date().toISOString(),
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: new Date().toISOString(),
  })
  @Expose()
  updatedAt: Date;
}
