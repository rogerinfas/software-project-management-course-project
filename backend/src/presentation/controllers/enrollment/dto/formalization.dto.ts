import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EducationalLevel } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStudentFromProspectRequest {
  @ApiProperty({ example: 'prospect-id-123' })
  @IsString()
  @IsNotEmpty()
  prospectId: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @IsNotEmpty()
  dni: string;

  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ enum: EducationalLevel, example: EducationalLevel.PRIMARY })
  @IsEnum(EducationalLevel)
  @IsNotEmpty()
  level: EducationalLevel;

  @ApiProperty({ example: '1° primaria' })
  @IsString()
  @IsNotEmpty()
  grade: string;
}

export class AssignGuardianToStudentRequest {
  @ApiProperty({ example: 'student-id-123' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ example: '87654321' })
  @IsString()
  @IsNotEmpty()
  guardianDni: string;

  @ApiProperty({ example: 'María Pérez' })
  @IsString()
  @IsNotEmpty()
  guardianName: string;

  @ApiProperty({ example: '+51 987654321' })
  @IsString()
  @IsNotEmpty()
  guardianPhone: string;

  @ApiPropertyOptional({ example: 'maria@example.com' })
  @IsString()
  @IsOptional()
  guardianEmail?: string;

  @ApiPropertyOptional({ example: 'Ingeniera' })
  @IsString()
  @IsOptional()
  guardianOccupation?: string;
}

export class EnrollStudentRequest {
  @ApiProperty({ example: 'student-id-123' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ example: 'section-id-123' })
  @IsString()
  @IsNotEmpty()
  sectionId: string;
}
