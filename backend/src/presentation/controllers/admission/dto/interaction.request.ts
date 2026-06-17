import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInteractionRequest {
  @ApiProperty({
    description: 'Type of interaction (e.g. llamada, correo, entrevista, nota)',
    example: 'llamada',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Summary of the interaction details',
    example: 'Se llamó al apoderado para coordinar la fecha del examen.',
  })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty({
    description: 'Author of the interaction record',
    example: 'Admisión',
  })
  @IsString()
  @IsNotEmpty()
  author: string;
}

export class UpdateInteractionRequest {
  @ApiProperty({
    description: 'Type of interaction (e.g. llamada, correo, entrevista, nota)',
    example: 'correo',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'Summary of the interaction details',
    example: 'Se envió correo de confirmación de entrevista académica.',
  })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiPropertyOptional({
    description: 'Author of the interaction record',
    example: 'Admisión',
  })
  @IsString()
  @IsOptional()
  author?: string;
}
