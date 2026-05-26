import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { TariffType, EducationalLevel } from '@prisma/client';

export class CreateTariffDto {
  @ApiProperty({ description: 'Concepto de la tarifa', example: 'Pensión Mensual de Mayo' })
  @IsString()
  @IsNotEmpty()
  concept: string;

  @ApiProperty({ description: 'Monto de la tarifa', example: 450.0 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ enum: TariffType, description: 'Tipo de cobro de la tarifa', example: TariffType.MONTHLY })
  @IsEnum(TariffType)
  @IsNotEmpty()
  type: TariffType;

  @ApiProperty({ enum: EducationalLevel, description: 'Nivel educativo aplicable', example: EducationalLevel.PRIMARY })
  @IsEnum(EducationalLevel)
  @IsNotEmpty()
  level: EducationalLevel;
}

export class UpdateTariffDto {
  @ApiProperty({ description: 'Concepto de la tarifa', example: 'Pensión Mayo Modificada', required: false })
  @IsString()
  @IsOptional()
  concept?: string;

  @ApiProperty({ description: 'Monto de la tarifa', example: 480.0, required: false })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ enum: TariffType, description: 'Tipo de cobro de la tarifa', example: TariffType.MONTHLY, required: false })
  @IsEnum(TariffType)
  @IsOptional()
  type?: TariffType;

  @ApiProperty({ enum: EducationalLevel, description: 'Nivel educativo aplicable', example: EducationalLevel.PRIMARY, required: false })
  @IsEnum(EducationalLevel)
  @IsOptional()
  level?: EducationalLevel;
}

export class TariffResponse {
  @ApiProperty({ description: 'ID de la tarifa', example: 'tariff-123' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Concepto de la tarifa', example: 'Pensión Mensual' })
  @Expose()
  concept: string;

  @ApiProperty({ description: 'Monto de la tarifa', example: 450.0 })
  @Expose()
  amount: number;

  @ApiProperty({ enum: TariffType, description: 'Tipo de cobro de la tarifa' })
  @Expose()
  type: TariffType;

  @ApiProperty({ enum: EducationalLevel, description: 'Nivel educativo aplicable' })
  @Expose()
  level: EducationalLevel;
}
