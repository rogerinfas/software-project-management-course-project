import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { EducationalLevel, ProspectPriority } from '@prisma/client';
import { AppointmentResponse } from './appointment.response';
import { EvaluationResultResponse } from './evaluation.response';

export class ProspectResponse {
  @ApiProperty({
    description: 'Unique prospect identifier',
    example: 'prospect-123',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Prospect full name',
    example: 'Carlos Delgado',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+51 987654321',
  })
  @Expose()
  phone: string;

  @ApiProperty({
    description: 'Target grade level',
    example: '1ro de Secundaria',
  })
  @Expose()
  targetGrade: string;

  @ApiProperty({
    description: 'Educational level',
    enum: EducationalLevel,
    example: EducationalLevel.SECONDARY,
  })
  @Expose()
  level: EducationalLevel;

  @ApiProperty({
    description: 'Prospect priority level',
    enum: ProspectPriority,
    example: ProspectPriority.MEDIUM,
  })
  @Expose()
  priority: ProspectPriority;

  @ApiProperty({
    description: 'Current admission stage ID',
    example: 'stage-123',
  })
  @Expose()
  currentStageId: string;

  @ApiProperty({
    description: 'List of scheduled appointments',
    type: () => [AppointmentResponse],
    required: false,
  })
  @Expose()
  @Type(() => AppointmentResponse)
  appointments?: AppointmentResponse[];

  @ApiPropertyOptional({
    description: 'Evaluation result if processed',
    type: () => EvaluationResultResponse,
  })
  @Expose()
  @Type(() => EvaluationResultResponse)
  evaluation?: EvaluationResultResponse | null;

  @ApiProperty({
    description: 'Creation date',
    example: new Date().toISOString(),
  })
  @Expose()
  createdAt: Date;
}
