import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { BaseAggregateRootEntity } from '../../config/entities/base-entities/blacklist-strategy/base.entity';
import { BaseEntityType } from '../../config/entities/base-entities/base-entity.types';
import { EducationalLevel } from '@prisma/client';
import { StudentEntity } from './student.entity';

export interface SectionType extends BaseEntityType {
  name: string;
  grade: string;
  level: EducationalLevel;
  capacity: number;
  status: string;
  students?: StudentEntity[];
}

export class SectionEntity
  extends BaseAggregateRootEntity<SectionEntity>
  implements SectionType
{
  @ApiProperty({ description: 'Nombre de la sección (ej. A, B, C)' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Grado escolar (ej. 1ro, 2do)' })
  @IsString()
  @IsNotEmpty()
  grade: string;

  @ApiProperty({ enum: EducationalLevel })
  @IsEnum(EducationalLevel)
  @IsNotEmpty()
  level: EducationalLevel;

  @ApiProperty({ description: 'Aforo máximo permitido' })
  @IsInt()
  @IsNotEmpty()
  capacity: number;

  @ApiProperty({ description: 'Estado de la sección (ej. OPEN, CLOSED)' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ type: () => [StudentEntity], required: false })
  students?: StudentEntity[];

  constructor(partial: Partial<SectionType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
