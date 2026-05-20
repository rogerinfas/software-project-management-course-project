import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EvaluationStatus } from '@prisma/client';

export class EvaluationResultResponse {
  @ApiProperty({
    description: 'Unique evaluation identifier',
    example: 'eval-123',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'ID of the associated prospect',
    example: 'prospect-123',
  })
  @Expose()
  prospectId: string;

  @ApiProperty({
    description: 'Evaluation status status',
    enum: EvaluationStatus,
    example: EvaluationStatus.FIT,
  })
  @Expose()
  aptitude: EvaluationStatus;

  @ApiPropertyOptional({
    description: 'Evaluation feedback comments',
    example: 'Buen desempeño en habilidades sociales.',
  })
  @Expose()
  comments: string | null;

  @ApiProperty({
    description: 'Evaluation process date',
    example: new Date().toISOString(),
  })
  @Expose()
  date: Date;

  @ApiPropertyOptional({
    description: 'ID of the evaluator staff',
    example: 'staff-456',
  })
  @Expose()
  evaluatorId: string | null;
}
