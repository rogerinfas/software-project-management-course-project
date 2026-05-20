import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAppointmentRequest {
  @ApiProperty({
    description: 'ID of the associated prospect',
    example: 'prospect-123',
  })
  @IsString()
  @IsNotEmpty()
  prospectId: string;

  @ApiProperty({
    description: 'Appointment date and time in ISO format',
    example: new Date().toISOString(),
  })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'Appointment type (e.g. Psicopedagógica, Entrevista)',
    example: 'Entrevista Familiar',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional({
    description: 'Additional notes or comments',
    example: 'Padres asistirán con el alumno.',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
