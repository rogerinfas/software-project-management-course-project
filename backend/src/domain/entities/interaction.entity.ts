import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { BaseAggregateRootEntity } from '../../config/entities/base-entities/blacklist-strategy/base.entity';
import { BaseEntityType } from '../../config/entities/base-entities/base-entity.types';
import { ProspectEntity } from './prospect.entity';

export interface ProspectInteractionType extends BaseEntityType {
  prospectId: string;
  type: string;
  summary: string;
  author: string;
  date: Date;
  prospect?: ProspectEntity;
}

export class ProspectInteractionEntity
  extends BaseAggregateRootEntity<ProspectInteractionEntity>
  implements ProspectInteractionType
{
  @ApiProperty({ description: 'Prospect ID' })
  @IsString()
  @IsNotEmpty()
  prospectId: string;

  @ApiProperty({ description: 'Type of interaction (e.g. llamada, correo)' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Interaction summary' })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty({ description: 'Interaction author' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ description: 'Date of the interaction' })
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ type: () => ProspectEntity, required: false })
  prospect?: ProspectEntity;

  constructor(partial: Partial<ProspectInteractionType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
