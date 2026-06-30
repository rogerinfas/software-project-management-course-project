import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EducationalLevel,
  ProspectPriority,
  ProspectStage,
  EvaluationStatus,
} from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProspectRequest {
  @ApiProperty({
    description: 'Prospect full name',
    example: 'Carlos Delgado',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+51 987654321',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Target grade level',
    example: '1ro de Secundaria',
  })
  @IsString()
  @IsNotEmpty()
  targetGrade: string;

  @ApiProperty({
    description: 'Educational level',
    enum: EducationalLevel,
    example: EducationalLevel.SECONDARY,
  })
  @IsEnum(EducationalLevel)
  @IsNotEmpty()
  level: EducationalLevel;

  @ApiProperty({
    description: 'Prospect priority level',
    enum: ProspectPriority,
    example: ProspectPriority.MEDIUM,
  })
  @IsEnum(ProspectPriority)
  @IsNotEmpty()
  priority: ProspectPriority;
}

export class UpdateProspectStageRequest {
  @ApiProperty({
    description: 'Target admission stage',
    enum: ProspectStage,
    example: ProspectStage.EVALUACION_ACADEMICA,
  })
  @IsEnum(ProspectStage)
  @IsNotEmpty()
  stage: ProspectStage;
}

export class GetProspectsPaginatedRequest {
  @ApiPropertyOptional({
    description: 'Page number (1-indexed)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 15,
    default: 15,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsInt()
  @Min(1)
  size: number = 15;

  @ApiPropertyOptional({
    description: 'Search by prospect name',
    example: 'Carlos',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by evaluation aptitude (e.g. FIT, UNFIT, PENDING)',
    enum: EvaluationStatus,
  })
  @IsOptional()
  @IsEnum(EvaluationStatus)
  aptitude?: EvaluationStatus;

  @ApiPropertyOptional({
    description: 'Include formalized prospects (students)',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  includeFormalized?: boolean;
}
