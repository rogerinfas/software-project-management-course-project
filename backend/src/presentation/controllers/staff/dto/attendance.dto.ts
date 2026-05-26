import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterAttendanceDto {
  @ApiProperty({ description: 'ID del perfil de personal' })
  @IsString()
  @IsNotEmpty()
  staffId: string;

  @ApiProperty({ description: 'Tipo de marcación (entry, exit)' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Fecha y hora de marcación opcional (si no, actual)' })
  @IsDateString()
  @IsOptional()
  timestamp?: string;

  @ApiProperty({ description: 'Método utilizado', default: 'FACIAL' })
  @IsString()
  @IsOptional()
  method?: string;
}
