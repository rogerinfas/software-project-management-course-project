import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseAggregateRootEntity } from '../../config/entities/base-entities/blacklist-strategy/base.entity';
import { BaseEntityType } from '../../config/entities/base-entities/base-entity.types';
import { ProspectEntity } from './prospect.entity';

export interface AdmissionStageType extends BaseEntityType {
  name: string;
  order: number;
  prospects?: ProspectEntity[];
}

export class AdmissionStageEntity
  extends BaseAggregateRootEntity<AdmissionStageEntity>
  implements AdmissionStageType
{
  @ApiProperty({ description: 'Stage name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Stage order in Kanban board' })
  @IsNumber()
  @IsNotEmpty()
  order: number;

  @ApiProperty({ type: () => [ProspectEntity], required: false })
  prospects?: ProspectEntity[];

  constructor(partial: Partial<AdmissionStageType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
