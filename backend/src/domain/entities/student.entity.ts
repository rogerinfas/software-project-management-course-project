import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseAggregateRootEntity } from '../../config/entities/base-entities/blacklist-strategy/base.entity';
import { BaseEntityType } from '../../config/entities/base-entities/base-entity.types';
import { EducationalLevel } from '@prisma/client';
import { GuardianEntity } from './guardian.entity';
import { SectionEntity } from './section.entity';
import { EnrollmentEntity } from './enrollment.entity';

export interface StudentType extends BaseEntityType {
  code?: string | null;
  firstName: string;
  lastName: string;
  dni: string;
  level: EducationalLevel;
  grade: string;
  sectionId?: string | null;
  section?: SectionEntity | null;
  guardianId: string;
  guardian?: GuardianEntity;
  enrollments?: EnrollmentEntity[];
}

export class StudentEntity
  extends BaseAggregateRootEntity<StudentEntity>
  implements StudentType
{
  @ApiProperty({ description: 'Código único de estudiante', required: false, nullable: true })
  @IsString()
  @IsOptional()
  code?: string | null;

  @ApiProperty({ description: 'Nombres del estudiante' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Apellidos del estudiante' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'DNI del estudiante' })
  @IsString()
  @IsNotEmpty()
  dni: string;

  @ApiProperty({ enum: EducationalLevel })
  @IsEnum(EducationalLevel)
  @IsNotEmpty()
  level: EducationalLevel;

  @ApiProperty({ description: 'Grado académico actual' })
  @IsString()
  @IsNotEmpty()
  grade: string;

  @ApiProperty({ description: 'ID de la sección asignada', required: false, nullable: true })
  @IsString()
  @IsOptional()
  sectionId?: string | null;

  @ApiProperty({ type: () => SectionEntity, required: false, nullable: true })
  section?: SectionEntity | null;

  @ApiProperty({ description: 'ID del apoderado' })
  @IsString()
  @IsNotEmpty()
  guardianId: string;

  @ApiProperty({ type: () => GuardianEntity, required: false })
  guardian?: GuardianEntity;

  @ApiProperty({ type: () => [EnrollmentEntity], required: false })
  enrollments?: EnrollmentEntity[];

  constructor(partial: Partial<StudentType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
