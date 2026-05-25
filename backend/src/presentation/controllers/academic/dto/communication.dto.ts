import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class CreateCommunicationDto {
  @ApiProperty({ description: 'Título del comunicado', example: 'Reunión de Padres' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Contenido completo', example: 'Se convoca a reunión...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Categoría (Urgente, Evento, Informativo)', example: 'Informativo' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: '¿Es visible actualmente?', default: true, required: false })
  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;

  @ApiProperty({ description: 'Fecha de caducidad (ISO string)', example: '2026-12-31T23:59:59.000Z', required: false, nullable: true })
  @IsDateString()
  @IsOptional()
  expiresAt?: string | null;
}

export class UpdateCommunicationDto {
  @ApiProperty({ description: 'Título del comunicado', example: 'Reunión de Padres Act.', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Contenido completo', example: 'Se convoca a reunión...', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: 'Categoría (Urgente, Evento, Informativo)', example: 'Informativo', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ description: '¿Es visible actualmente?', required: false })
  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;

  @ApiProperty({ description: 'Fecha de caducidad (ISO string)', required: false, nullable: true })
  @IsDateString()
  @IsOptional()
  expiresAt?: string | null;
}

export class CommunicationResponse {
  @ApiProperty({ description: 'ID del comunicado', example: 'comm-123' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Título del comunicado', example: 'Reunión de Padres' })
  @Expose()
  title: string;

  @ApiProperty({ description: 'Contenido completo', example: 'Se convoca a reunión...' })
  @Expose()
  content: string;

  @ApiProperty({ description: 'Categoría', example: 'Informativo' })
  @Expose()
  category: string;

  @ApiProperty({ description: '¿Es visible actualmente?', example: true })
  @Expose()
  isVisible: boolean;

  @ApiProperty({ description: 'Fecha de caducidad', example: '2026-12-31T23:59:59.000Z', nullable: true })
  @Expose()
  expiresAt?: Date | null;

  @ApiProperty({ description: 'Fecha de creación', example: '2026-05-25T10:00:00.000Z' })
  @Expose()
  createdAt: Date;
}
