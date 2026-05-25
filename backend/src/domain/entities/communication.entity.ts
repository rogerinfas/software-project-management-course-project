import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseAggregateRootEntity } from '../../config/entities/base-entities/blacklist-strategy/base.entity';
import { BaseEntityType } from '../../config/entities/base-entities/base-entity.types';

export interface CommunicationType extends BaseEntityType {
  title: string;
  content: string;
  category: string;
  isVisible?: boolean;
  expiresAt?: Date | null;
}

export class CommunicationEntity
  extends BaseAggregateRootEntity<CommunicationEntity>
  implements CommunicationType
{
  @ApiProperty({ description: 'Título del comunicado' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Contenido completo del comunicado' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Categoría del comunicado (Urgente, Evento, Informativo)' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'Visibilidad del comunicado', default: true })
  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;

  @ApiProperty({ description: 'Fecha de vencimiento del comunicado', required: false, nullable: true })
  @IsDate()
  @IsOptional()
  expiresAt?: Date | null;

  constructor(partial: Partial<CommunicationType>) {
    super(partial);
    Object.assign(this, partial);
  }
}

