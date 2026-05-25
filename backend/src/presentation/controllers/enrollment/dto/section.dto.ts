import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EducationalLevel } from '@prisma/client';

export class SectionResponse {
  @ApiProperty({ description: 'ID de la sección', example: 'section-123' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Nombre (ej. A, B, C)', example: 'A' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Grado', example: '1ro de Primaria' })
  @Expose()
  grade: string;

  @ApiProperty({ enum: EducationalLevel, example: EducationalLevel.PRIMARY })
  @Expose()
  level: EducationalLevel;

  @ApiProperty({ description: 'Aforo máximo permitido', example: 30 })
  @Expose()
  capacity: number;

  @ApiProperty({ description: 'Estado (ej. OPEN, CLOSED)', example: 'OPEN' })
  @Expose()
  status: string;

  @ApiProperty({ description: 'Cantidad actual de alumnos matriculados', example: 12 })
  @Expose()
  matriculados?: number;
}
