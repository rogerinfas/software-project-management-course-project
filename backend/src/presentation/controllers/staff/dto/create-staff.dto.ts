import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateStaffProfileDto {
  @ApiProperty({ description: 'ID de usuario asignado al perfil' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Especialidad profesional' })
  @IsString()
  @IsNotEmpty()
  specialty: string;

  @ApiProperty({ description: 'URL del CV o expediente', required: false })
  @IsString()
  @IsOptional()
  cvUrl?: string;

  @ApiProperty({ description: 'Hora de entrada (HH:mm)', default: '08:00' })
  @IsString()
  @IsOptional()
  entryTime?: string;

  @ApiProperty({ description: 'Hora de salida (HH:mm)', default: '16:00' })
  @IsString()
  @IsOptional()
  exitTime?: string;

  @ApiProperty({ description: 'Minutos de gracia permitidos', default: 5 })
  @IsInt()
  @Min(0)
  @IsOptional()
  gracePeriod?: number;
}

export class UpdateStaffProfileDto {
  @ApiProperty({ description: 'Especialidad profesional', required: false })
  @IsString()
  @IsOptional()
  specialty?: string;

  @ApiProperty({ description: 'URL del CV o expediente', required: false })
  @IsString()
  @IsOptional()
  cvUrl?: string;

  @ApiProperty({ description: 'Hora de entrada (HH:mm)', required: false })
  @IsString()
  @IsOptional()
  entryTime?: string;

  @ApiProperty({ description: 'Hora de salida (HH:mm)', required: false })
  @IsString()
  @IsOptional()
  exitTime?: string;

  @ApiProperty({ description: 'Minutos de gracia permitidos', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  gracePeriod?: number;
}
