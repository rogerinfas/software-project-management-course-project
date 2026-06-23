import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseAggregateRootEntity } from '../../config/entities/base-entities/blacklist-strategy/base.entity';
import { BaseEntityType } from '../../config/entities/base-entities/base-entity.types';
import { EnrollmentStatus } from '@prisma/client';
import { StudentEntity } from './student.entity';

export interface EnrollmentType extends BaseEntityType {
  studentId: string;
  student?: StudentEntity;
  year: number;
  date: Date;
  status: EnrollmentStatus;
  pdfUrl?: string | null;
}

export class EnrollmentEntity
  extends BaseAggregateRootEntity<EnrollmentEntity>
  implements EnrollmentType
{
  @ApiProperty({ description: 'ID del estudiante matriculado' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ type: () => StudentEntity, required: false })
  student?: StudentEntity;

  @ApiProperty({ description: 'Año académico de la matrícula' })
  @IsInt()
  @IsNotEmpty()
  year: number;

  @ApiProperty({ description: 'Fecha de la matrícula' })
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @ApiProperty({
    enum: EnrollmentStatus,
    description: 'Estado de la matrícula',
  })
  @IsEnum(EnrollmentStatus)
  @IsNotEmpty()
  status: EnrollmentStatus;

  @ApiProperty({
    description: 'URL de la Ficha de Matrícula generada en PDF',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  pdfUrl?: string | null;

  constructor(partial: Partial<EnrollmentType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
