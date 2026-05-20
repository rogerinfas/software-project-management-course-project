import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseAggregateRootEntity } from '../../config/entities/base-entities/blacklist-strategy/base.entity';
import { BaseEntityType } from '../../config/entities/base-entities/base-entity.types';
import { ProspectEntity } from './prospect.entity';

export interface AppointmentType extends BaseEntityType {
  date: Date;
  type: string;
  prospectId: string;
  notes?: string | null;
  prospect?: ProspectEntity;
}

export class AppointmentEntity
  extends BaseAggregateRootEntity<AppointmentEntity>
  implements AppointmentType
{
  @ApiProperty({ description: 'Scheduled date and time' })
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ description: 'Appointment type (e.g. Interview)' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Prospect ID' })
  @IsString()
  @IsNotEmpty()
  prospectId: string;

  @ApiProperty({ description: 'Optional notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string | null;

  @ApiProperty({ type: () => ProspectEntity, required: false })
  prospect?: ProspectEntity;

  constructor(partial: Partial<AppointmentType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
