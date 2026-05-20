import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProspectResponse } from './prospect.response';

export class AppointmentResponse {
  @ApiProperty({
    description: 'Unique appointment identifier',
    example: 'appointment-123',
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
    description: 'Appointment date and time',
    example: new Date().toISOString(),
  })
  @Expose()
  date: Date;

  @ApiProperty({
    description: 'Appointment type',
    example: 'Entrevista Familiar',
  })
  @Expose()
  type: string;

  @ApiPropertyOptional({
    description: 'Additional notes or comments',
    example: 'Padres asistirán con el alumno.',
  })
  @Expose()
  notes: string | null;

  @ApiPropertyOptional({
    description: 'Associated prospect details',
    type: () => ProspectResponse,
  })
  @Expose()
  @Type(() => ProspectResponse)
  prospect?: ProspectResponse;

  @ApiProperty({
    description: 'Creation date',
    example: new Date().toISOString(),
  })
  @Expose()
  createdAt: Date;
}
