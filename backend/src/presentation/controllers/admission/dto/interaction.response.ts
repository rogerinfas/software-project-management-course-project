import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProspectInteractionResponse {
  @ApiProperty({
    description: 'Unique interaction identifier',
    example: 'interaction-123',
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
    description: 'Type of interaction (e.g. llamada, correo, nota)',
    example: 'llamada',
  })
  @Expose()
  type: string;

  @ApiProperty({
    description: 'Summary of the interaction',
    example: 'Llamada para coordinar examen.',
  })
  @Expose()
  summary: string;

  @ApiProperty({
    description: 'Author of the record',
    example: 'Admisión',
  })
  @Expose()
  author: string;

  @ApiProperty({
    description: 'Date and time of the interaction',
    example: new Date().toISOString(),
  })
  @Expose()
  date: Date;
}
