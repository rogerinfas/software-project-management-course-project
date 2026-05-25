import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, Matches } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { SectionResponse } from '../../enrollment/dto/section.dto';
import { CourseResponse } from './course.dto';

export class CreateScheduleDto {
  @ApiProperty({ description: 'ID de la sección', example: 'sec-123' })
  @IsString()
  @IsNotEmpty()
  sectionId: string;

  @ApiProperty({ description: 'ID del curso', example: 'course-123' })
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @ApiProperty({ description: 'ID del perfil de personal (docente)', example: 'staff-123' })
  @IsString()
  @IsNotEmpty()
  staffId: string;

  @ApiProperty({ description: 'Día de la semana (1: Lunes, ..., 5: Viernes)', example: 1 })
  @IsInt()
  @Min(1)
  @Max(7)
  @IsNotEmpty()
  day: number;

  @ApiProperty({ description: 'Hora de inicio (HH:mm)', example: '08:00' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'startTime debe tener formato HH:mm' })
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ description: 'Hora de fin (HH:mm)', example: '09:30' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'endTime debe tener formato HH:mm' })
  @IsNotEmpty()
  endTime: string;
}

export class UpdateScheduleDto {
  @ApiProperty({ description: 'ID de la sección', example: 'sec-123', required: false })
  @IsString()
  @IsOptional()
  sectionId?: string;

  @ApiProperty({ description: 'ID del curso', example: 'course-123', required: false })
  @IsString()
  @IsOptional()
  courseId?: string;

  @ApiProperty({ description: 'ID del perfil de personal (docente)', example: 'staff-123', required: false })
  @IsString()
  @IsOptional()
  staffId?: string;

  @ApiProperty({ description: 'Día de la semana', example: 1, required: false })
  @IsInt()
  @Min(1)
  @Max(7)
  @IsOptional()
  day?: number;

  @ApiProperty({ description: 'Hora de inicio (HH:mm)', example: '08:00', required: false })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'startTime debe tener formato HH:mm' })
  @IsOptional()
  startTime?: string;

  @ApiProperty({ description: 'Hora de fin (HH:mm)', example: '09:30', required: false })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'endTime debe tener formato HH:mm' })
  @IsOptional()
  endTime?: string;
}

class UserMinimalResponse {
  @ApiProperty({ description: 'Nombre completo' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Correo electrónico' })
  @Expose()
  email: string;
}

class TeacherMinimalResponse {
  @ApiProperty({ description: 'ID del perfil del docente' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Especialidad' })
  @Expose()
  specialty: string;

  @ApiProperty({ type: UserMinimalResponse })
  @Expose()
  user: UserMinimalResponse;
}

export class ScheduleResponse {
  @ApiProperty({ description: 'ID del horario', example: 'sched-123' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'ID de la sección', example: 'sec-123' })
  @Expose()
  sectionId: string;

  @ApiProperty({ type: () => SectionResponse, required: false })
  @Expose()
  @Type(() => SectionResponse)
  section?: SectionResponse;

  @ApiProperty({ description: 'ID del curso', example: 'course-123' })
  @Expose()
  courseId: string;

  @ApiProperty({ type: () => CourseResponse, required: false })
  @Expose()
  @Type(() => CourseResponse)
  course?: CourseResponse;

  @ApiProperty({ description: 'ID del docente', example: 'staff-123' })
  @Expose()
  staffId: string;

  @ApiProperty({ type: () => TeacherMinimalResponse, required: false })
  @Expose()
  @Type(() => TeacherMinimalResponse)
  staff?: TeacherMinimalResponse;

  @ApiProperty({ description: 'Día de la semana', example: 1 })
  @Expose()
  day: number;

  @ApiProperty({ description: 'Hora de inicio', example: '08:00' })
  @Expose()
  startTime: string;

  @ApiProperty({ description: 'Hora de fin', example: '09:30' })
  @Expose()
  endTime: string;
}
