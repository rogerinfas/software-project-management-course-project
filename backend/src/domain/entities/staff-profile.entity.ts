import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { BaseAggregateRootEntity } from '../../config/entities/base-entities/blacklist-strategy/base.entity';
import { BaseEntityType } from '../../config/entities/base-entities/base-entity.types';
import { UserEntity } from './user.entity';

export interface StaffProfileType extends BaseEntityType {
  userId: string;
  user?: UserEntity | null;
  specialty: string;
  cvUrl?: string | null;
  entryTime: string;
  exitTime: string;
  gracePeriod: number;
}

export class StaffProfileEntity
  extends BaseAggregateRootEntity<StaffProfileEntity>
  implements StaffProfileType
{
  @ApiProperty({ description: 'ID de usuario asociado' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ type: () => UserEntity, required: false, nullable: true })
  user?: UserEntity | null;

  @ApiProperty({ description: 'Especialidad profesional' })
  @IsString()
  @IsNotEmpty()
  specialty: string;

  @ApiProperty({ description: 'URL del CV o expediente', required: false, nullable: true })
  @IsString()
  @IsOptional()
  cvUrl?: string | null;

  @ApiProperty({ description: 'Hora de entrada (HH:mm)', default: '08:00' })
  @IsString()
  @IsNotEmpty()
  entryTime: string;

  @ApiProperty({ description: 'Hora de salida (HH:mm)', default: '16:00' })
  @IsString()
  @IsNotEmpty()
  exitTime: string;

  @ApiProperty({ description: 'Minutos de gracia permitidos', default: 5 })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  gracePeriod: number;

  constructor(partial: Partial<StaffProfileType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
