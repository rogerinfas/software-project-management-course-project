import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EvaluationStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SaveEvaluationRequest {
  @ApiProperty({
    description: 'Evaluation aptitude status',
    enum: EvaluationStatus,
    example: EvaluationStatus.FIT,
  })
  @IsEnum(EvaluationStatus)
  @IsNotEmpty()
  aptitude: EvaluationStatus;

  @ApiPropertyOptional({
    description: 'Evaluation feedback comments',
    example: 'Buen desempeño en habilidades sociales.',
  })
  @IsString()
  @IsOptional()
  comments?: string;
}
