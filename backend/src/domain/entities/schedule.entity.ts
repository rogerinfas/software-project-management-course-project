import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { BaseAggregateRootEntity } from '../../config/entities/base-entities/blacklist-strategy/base.entity';
import { BaseEntityType } from '../../config/entities/base-entities/base-entity.types';
import { SectionEntity } from './section.entity';
import { CourseEntity } from './course.entity';

export interface ScheduleType extends BaseEntityType {
  sectionId: string;
  section?: SectionEntity | null;
  courseId: string;
  course?: CourseEntity | null;
  staffId: string;
  day: number;
  startTime: string;
  endTime: string;
}

export class ScheduleEntity
  extends BaseAggregateRootEntity<ScheduleEntity>
  implements ScheduleType
{
  @ApiProperty({ description: 'ID de la sección asignada' })
  @IsString()
  @IsNotEmpty()
  sectionId: string;

  @ApiProperty({ type: () => SectionEntity, required: false, nullable: true })
  section?: SectionEntity | null;

  @ApiProperty({ description: 'ID del curso asignado' })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({ type: () => CourseEntity, required: false, nullable: true })
  course?: CourseEntity | null;

  @ApiProperty({ description: 'ID del perfil de personal (docente)' })
  @IsString()
  @IsNotEmpty()
  staffId: string;

  @ApiProperty({ description: 'Día de la semana (1-7: Lunes-Domingo)' })
  @IsInt()
  @Min(1)
  @Max(7)
  @IsNotEmpty()
  day: number;

  @ApiProperty({ description: 'Hora de inicio de la sesión (HH:mm)' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ description: 'Hora de fin de la sesión (HH:mm)' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  constructor(partial: Partial<ScheduleType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
