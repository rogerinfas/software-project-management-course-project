import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { EducationalLevel, SectionStatus } from '@prisma/client';

export class CreateSectionDto {
  @ApiProperty({
    description: 'Nombre de la sección (ej. A, B, C)',
    example: 'A',
  })
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

  @ApiProperty({
    enum: SectionStatus,
    description: 'Estado',
    example: SectionStatus.OPEN,
    required: false,
    default: SectionStatus.OPEN,
  })
  @IsEnum(SectionStatus)
  @IsOptional()
  status?: SectionStatus;
}

export class UpdateSectionDto {
  @ApiProperty({
    description: 'Nombre de la sección',
    example: 'B',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Grado académico',
    example: '1ro de Primaria',
    required: false,
  })
  @IsString()
  @IsOptional()
  grade?: string;

  @ApiProperty({
    enum: EducationalLevel,
    example: EducationalLevel.PRIMARY,
    required: false,
  })
  @IsEnum(EducationalLevel)
  @IsOptional()
  level?: EducationalLevel;

  @ApiProperty({
    description: 'Aforo máximo permitido',
    example: 30,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  capacity?: number;

  @ApiProperty({
    enum: SectionStatus,
    description: 'Estado',
    example: SectionStatus.CLOSED,
    required: false,
  })
  @IsEnum(SectionStatus)
  @IsOptional()
  status?: SectionStatus;
}
export { SectionResponse } from '../../enrollment/dto/section.dto';
