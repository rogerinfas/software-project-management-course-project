import { PartialType, OmitType } from '@nestjs/swagger';
import { BaseUserDto } from './base-user.dto';

export class UpdateUserRequest extends PartialType(
  OmitType(BaseUserDto, ['email', 'role'] as const),
) {}
