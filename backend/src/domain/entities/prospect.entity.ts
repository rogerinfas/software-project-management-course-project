import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BaseAggregateRootEntity } from '../../config/entities/base-entities/blacklist-strategy/base.entity';
import { BaseEntityType } from '../../config/entities/base-entities/base-entity.types';
import { EducationalLevel, ProspectPriority } from '@prisma/client';
import { AppointmentEntity } from './appointment.entity';
import { EvaluationResultEntity } from './evaluation-result.entity';

export interface ProspectType extends BaseEntityType {
  name: string;
  phone: string;
  targetGrade: string;
  level: EducationalLevel;
  priority: ProspectPriority;
  currentStageId: string;
  appointments?: AppointmentEntity[];
  evaluation?: EvaluationResultEntity | null;
}

export class ProspectEntity
  extends BaseAggregateRootEntity<ProspectEntity>
  implements ProspectType
{
  @ApiProperty({ description: 'Prospect full name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Prospect phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Target Grade' })
  @IsString()
  @IsNotEmpty()
  targetGrade: string;

  @ApiProperty({ enum: EducationalLevel })
  @IsEnum(EducationalLevel)
  @IsNotEmpty()
  level: EducationalLevel;

  @ApiProperty({ enum: ProspectPriority })
  @IsEnum(ProspectPriority)
  @IsNotEmpty()
  priority: ProspectPriority;

  @ApiProperty({ description: 'Current admission stage ID' })
  @IsString()
  @IsNotEmpty()
  currentStageId: string;

  @ApiProperty({ type: () => [AppointmentEntity], required: false })
  appointments?: AppointmentEntity[];

  @ApiProperty({
    type: () => EvaluationResultEntity,
    required: false,
    nullable: true,
  })
  evaluation?: EvaluationResultEntity | null;

  constructor(partial: Partial<ProspectType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
