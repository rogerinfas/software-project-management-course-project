import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { EducationalLevel } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StudentResponse } from './student.dto';
import { PaginationMeta } from './guardian.dto';

export class FormalizeEnrollmentRequest {
  @ApiProperty({ description: 'Nombres del alumno', example: 'Luis' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Apellidos del alumno', example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'DNI del alumno', example: '87654321' })
  @IsString()
  @IsNotEmpty()
  dni: string;

  @ApiProperty({ enum: EducationalLevel, example: EducationalLevel.PRIMARY })
  @IsEnum(EducationalLevel)
  @IsNotEmpty()
  level: EducationalLevel;

  @ApiProperty({ description: 'Grado de postulación', example: '1ro de Primaria' })
  @IsString()
  @IsNotEmpty()
  grade: string;

  @ApiProperty({ description: 'ID de la sección asignada', example: 'section-123' })
  @IsString()
  @IsNotEmpty()
  sectionId: string;

  @ApiProperty({ description: 'DNI del apoderado', example: '12345678' })
  @IsString()
  @IsNotEmpty()
  guardianDni: string;

  @ApiProperty({ description: 'Nombre del apoderado', example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  guardianName: string;

  @ApiProperty({ description: 'Teléfono del apoderado', example: '987654321' })
  @IsString()
  @IsNotEmpty()
  guardianPhone: string;

  @ApiPropertyOptional({ description: 'Correo del apoderado', example: 'juan.perez@gmail.com', type: String, nullable: true })
  @IsString()
  @IsOptional()
  guardianEmail?: string | null;

  @ApiPropertyOptional({ description: 'Ocupación del apoderado', example: 'Ingeniero', type: String, nullable: true })
  @IsString()
  @IsOptional()
  guardianOccupation?: string | null;
}

export class EnrollmentResponse {
  @ApiProperty({ description: 'ID único de la matrícula', example: 'enrollment-123' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'ID del estudiante', example: 'student-123' })
  @Expose()
  studentId: string;

  @ApiPropertyOptional({ type: () => StudentResponse })
  @Expose()
  @Type(() => StudentResponse)
  student?: StudentResponse;

  @ApiProperty({ description: 'Año de la matrícula', example: 2026 })
  @Expose()
  year: number;

  @ApiProperty({ description: 'Fecha de la matrícula', example: new Date().toISOString() })
  @Expose()
  date: Date;

  @ApiProperty({ description: 'Estado', example: 'activa' })
  @Expose()
  status: string;

  @ApiPropertyOptional({ description: 'URL de la Ficha de Matrícula PDF', example: '/pdf/ficha-matricula-student-123.pdf', type: String, nullable: true })
  @Expose()
  pdfUrl?: string | null;
}

export class PaginatedEnrollmentsResponse {
  @ApiProperty({ type: () => [EnrollmentResponse] })
  data: EnrollmentResponse[];

  @ApiProperty({ type: () => PaginationMeta })
  meta: PaginationMeta;
}
