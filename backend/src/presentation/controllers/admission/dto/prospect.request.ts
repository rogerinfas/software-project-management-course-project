import { ApiProperty } from '@nestjs/swagger';
import { EducationalLevel, ProspectPriority } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateProspectRequest {
  @ApiProperty({
    description: 'Prospect full name',
    example: 'Carlos Delgado',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '+51 987654321',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Target grade level',
    example: '1ro de Secundaria',
  })
  @IsString()
  @IsNotEmpty()
  targetGrade: string;

  @ApiProperty({
    description: 'Educational level',
    enum: EducationalLevel,
    example: EducationalLevel.SECONDARY,
  })
  @IsEnum(EducationalLevel)
  @IsNotEmpty()
  level: EducationalLevel;

  @ApiProperty({
    description: 'Prospect priority level',
    enum: ProspectPriority,
    example: ProspectPriority.MEDIUM,
  })
  @IsEnum(ProspectPriority)
  @IsNotEmpty()
  priority: ProspectPriority;

  @ApiProperty({
    description: 'Initial admission stage ID',
    example: 'stage-123',
  })
  @IsString()
  @IsNotEmpty()
  currentStageId: string;
}

export class UpdateProspectStageRequest {
  @ApiProperty({
    description: 'Target admission stage ID',
    example: 'stage-456',
  })
  @IsString()
  @IsNotEmpty()
  currentStageId: string;
}
