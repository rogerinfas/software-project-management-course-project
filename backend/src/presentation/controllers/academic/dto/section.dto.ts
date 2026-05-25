import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { EducationalLevel } from '@prisma/client';

export class CreateSectionDto {
  @ApiProperty({ description: 'Nombre de la sección (ej. A, B, C)', example: 'A' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Grado académico', example: '1ro de Primaria' })
  @IsString()
  @IsNotEmpty()
  grade: string;

  @ApiProperty({ enum: EducationalLevel, example: EducationalLevel.PRIMARY })
  @IsEnum(EducationalLevel)
  @IsNotEmpty()
  level: EducationalLevel;

  @ApiProperty({ description: 'Aforo máximo permitido', example: 25 })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsNotEmpty()
  capacity: number;

  @ApiProperty({ description: 'Estado', example: 'OPEN', required: false, default: 'OPEN' })
  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdateSectionDto {
  @ApiProperty({ description: 'Nombre de la sección', example: 'B', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Grado académico', example: '1ro de Primaria', required: false })
  @IsString()
  @IsOptional()
  grade?: string;

  @ApiProperty({ enum: EducationalLevel, example: EducationalLevel.PRIMARY, required: false })
  @IsEnum(EducationalLevel)
  @IsOptional()
  level?: EducationalLevel;

  @ApiProperty({ description: 'Aforo máximo permitido', example: 30, required: false })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  capacity?: number;

  @ApiProperty({ description: 'Estado', example: 'CLOSED', required: false })
  @IsString()
  @IsOptional()
  status?: string;
}
export { SectionResponse } from '../../enrollment/dto/section.dto';
