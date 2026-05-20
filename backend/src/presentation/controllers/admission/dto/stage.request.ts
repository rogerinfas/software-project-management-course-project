import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStageRequest {
  @ApiProperty({
    description: 'Stage name',
    example: 'Entrevista',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Stage display order',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  order: number;
}

export class UpdateStageRequest {
  @ApiPropertyOptional({
    description: 'Stage name',
    example: 'Entrevista Modificada',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Stage display order',
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  order?: number;
}
