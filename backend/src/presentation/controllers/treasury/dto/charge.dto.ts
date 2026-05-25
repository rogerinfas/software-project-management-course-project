import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { StudentResponse } from '../../enrollment/dto/student.dto';
import { TariffResponse } from './tariff.dto';

export class CreateChargeDto {
  @ApiProperty({ description: 'ID del estudiante', example: 'student-123' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ description: 'ID de la tarifa', example: 'tariff-123' })
  @IsString()
  @IsNotEmpty()
  tariffId: string;

  @ApiProperty({ description: 'Fecha de vencimiento', example: '2026-06-05T00:00:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}

export class GenerateBulkChargesDto {
  @ApiProperty({ description: 'ID de la tarifa a aplicar', example: 'tariff-123' })
  @IsString()
  @IsNotEmpty()
  tariffId: string;

  @ApiProperty({ description: 'Fecha de vencimiento para los cargos', example: '2026-06-05T00:00:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}

export class ChargeResponse {
  @ApiProperty({ description: 'ID del cargo', example: 'charge-123' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'ID del estudiante', example: 'student-123' })
  @Expose()
  studentId: string;

  @ApiProperty({ type: () => StudentResponse, required: false })
  @Expose()
  student?: StudentResponse;

  @ApiProperty({ description: 'ID de la tarifa', example: 'tariff-123' })
  @Expose()
  tariffId: string;

  @ApiProperty({ type: () => TariffResponse, required: false })
  @Expose()
  tariff?: TariffResponse;

  @ApiProperty({ description: 'Monto original', example: 450.0 })
  @Expose()
  originalAmount: number;

  @ApiProperty({ description: 'Monto pendiente', example: 450.0 })
  @Expose()
  pendingAmount: number;

  @ApiProperty({ description: 'Fecha de vencimiento', example: '2026-06-05T00:00:00.000Z', nullable: true })
  @Expose()
  dueDate?: Date | null;

  @ApiProperty({ description: 'Estado del cargo', example: 'PENDING' })
  @Expose()
  status: string;
}
