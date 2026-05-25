import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateCourseDto {
  @ApiProperty({ description: 'Nombre del curso', example: 'Matemática' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Descripción del curso', example: 'Álgebra, geometría y aritmética', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateCourseDto {
  @ApiProperty({ description: 'Nombre del curso', example: 'Matemática Avanzada', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Descripción del curso', example: 'Álgebra y cálculo', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class CourseResponse {
  @ApiProperty({ description: 'ID del curso', example: 'course-123' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Nombre del curso', example: 'Matemática' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Descripción del curso', example: 'Álgebra, geometría y aritmética', nullable: true })
  @Expose()
  description?: string | null;
}
