import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { EducationalLevel } from '@prisma/client';
import { GuardianResponse, PaginationMeta } from './guardian.dto';
import { SectionResponse } from './section.dto';

export class StudentResponse {
  @ApiProperty({ description: 'ID único del estudiante', example: 'student-123' })
  @Expose()
  id: string;

  @ApiPropertyOptional({ description: 'Código de estudiante', example: 'ALU-2026-1234', type: String, nullable: true })
  @Expose()
  code?: string | null;

  @ApiProperty({ description: 'Nombres', example: 'Luis' })
  @Expose()
  firstName: string;

  @ApiProperty({ description: 'Apellidos', example: 'Pérez' })
  @Expose()
  lastName: string;

  @ApiProperty({ description: 'DNI', example: '87654321' })
  @Expose()
  dni: string;

  @ApiProperty({ enum: EducationalLevel, example: EducationalLevel.PRIMARY })
  @Expose()
  level: EducationalLevel;

  @ApiProperty({ description: 'Grado', example: '1ro de Primaria' })
  @Expose()
  grade: string;

  @ApiPropertyOptional({ description: 'ID de la sección', example: 'section-123', type: String, nullable: true })
  @Expose()
  sectionId?: string | null;

  @ApiPropertyOptional({ type: () => SectionResponse, nullable: true })
  @Expose()
  @Type(() => SectionResponse)
  section?: SectionResponse | null;

  @ApiProperty({ description: 'ID del apoderado', example: 'guardian-123' })
  @Expose()
  guardianId: string;

  @ApiPropertyOptional({ type: () => GuardianResponse })
  @Expose()
  @Type(() => GuardianResponse)
  guardian?: GuardianResponse;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  createdAt: Date;
}

export class PaginatedStudentsResponse {
  @ApiProperty({ type: () => [StudentResponse] })
  data: StudentResponse[];

  @ApiProperty({ type: () => PaginationMeta })
  meta: PaginationMeta;
}
