import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Expose, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { StudentResponse } from './student.dto';

export class CreateGuardianRequest {
  @ApiProperty({ description: 'DNI del apoderado', example: '12345678' })
  @IsString()
  @IsNotEmpty()
  dni: string;

  @ApiProperty({ description: 'Nombre completo', example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Teléfono de contacto', example: '987654321' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ description: 'Correo electrónico', example: 'juan.perez@gmail.com', type: String, nullable: true })
  @IsString()
  @IsOptional()
  email?: string | null;

  @ApiPropertyOptional({ description: 'Ocupación', example: 'Ingeniero', type: String, nullable: true })
  @IsString()
  @IsOptional()
  occupation?: string | null;
}

export class UpdateGuardianRequest {
  @ApiPropertyOptional({ description: 'DNI del apoderado', example: '12345678' })
  @IsString()
  @IsOptional()
  dni?: string;

  @ApiPropertyOptional({ description: 'Nombre completo', example: 'Juan Pérez' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Teléfono de contacto', example: '987654321' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Correo electrónico', example: 'juan.perez@gmail.com', type: String, nullable: true })
  @IsString()
  @IsOptional()
  email?: string | null;

  @ApiPropertyOptional({ description: 'Ocupación', example: 'Ingeniero', type: String, nullable: true })
  @IsString()
  @IsOptional()
  occupation?: string | null;
}

export class GetGuardiansPaginatedRequest {
  @ApiPropertyOptional({ description: 'Número de página (1-indexed)', example: 1, default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ description: 'Tamaño de página', example: 15, default: 15 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsInt()
  @Min(1)
  size: number = 15;

  @ApiPropertyOptional({ description: 'Búsqueda por nombre o DNI', example: 'Juan' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class GuardianResponse {
  @ApiProperty({ description: 'ID único del apoderado', example: 'guardian-123' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'DNI del apoderado', example: '12345678' })
  @Expose()
  dni: string;

  @ApiProperty({ description: 'Nombre completo', example: 'Juan Pérez' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Teléfono de contacto', example: '987654321' })
  @Expose()
  phone: string;

  @ApiPropertyOptional({ description: 'Correo electrónico', example: 'juan.perez@gmail.com', type: String, nullable: true })
  @Expose()
  email?: string | null;

  @ApiPropertyOptional({ description: 'Ocupación', example: 'Ingeniero', type: String, nullable: true })
  @Expose()
  occupation?: string | null;

  @ApiProperty({ type: () => [StudentResponse], required: false })
  @Expose()
  @Type(() => StudentResponse)
  students?: StudentResponse[];
}

export class PaginationMeta {
  @ApiProperty({ description: 'Total de registros' })
  total: number;

  @ApiProperty({ description: 'Página actual' })
  page: number;

  @ApiProperty({ description: 'Tamaño de página' })
  size: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPages: number;

  @ApiProperty({ description: 'Tiene página siguiente' })
  hasNext: boolean;
}

export class PaginatedGuardiansResponse {
  @ApiProperty({ type: () => [GuardianResponse] })
  data: GuardianResponse[];

  @ApiProperty({ type: () => PaginationMeta })
  meta: PaginationMeta;
}
