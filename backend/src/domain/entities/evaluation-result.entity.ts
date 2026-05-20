import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';
import { BaseAggregateRootEntity } from '../../config/entities/base-entities/blacklist-strategy/base.entity';
import { BaseEntityType } from '../../config/entities/base-entities/base-entity.types';
import { EvaluationStatus } from '@prisma/client';
import { ProspectEntity } from './prospect.entity';

export interface EvaluationResultType extends BaseEntityType {
  prospectId: string;
  aptitude: EvaluationStatus;
  comments?: string | null;
  evaluatorId?: string | null;
  date?: Date;
  prospect?: ProspectEntity;
}

export class EvaluationResultEntity
  extends BaseAggregateRootEntity<EvaluationResultEntity>
  implements EvaluationResultType
{
  @ApiProperty({ description: 'Prospect ID' })
  @IsString()
  @IsNotEmpty()
  prospectId: string;

  @ApiProperty({ enum: EvaluationStatus })
  @IsEnum(EvaluationStatus)
  @IsNotEmpty()
  aptitude: EvaluationStatus;

  @ApiProperty({ description: 'Evaluation comments', required: false })
  @IsString()
  @IsOptional()
  comments?: string | null;

  @ApiProperty({ description: 'Evaluator User ID', required: false })
  @IsString()
  @IsOptional()
  evaluatorId?: string | null;

  @ApiProperty({ description: 'Evaluation date', required: false })
  @IsDate()
  @IsOptional()
  date?: Date;

  @ApiProperty({ type: () => ProspectEntity, required: false })
  prospect?: ProspectEntity;

  constructor(partial: Partial<EvaluationResultType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
