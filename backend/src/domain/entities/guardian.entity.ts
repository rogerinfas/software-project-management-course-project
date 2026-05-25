import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseAggregateRootEntity } from '../../config/entities/base-entities/blacklist-strategy/base.entity';
import { BaseEntityType } from '../../config/entities/base-entities/base-entity.types';
import { StudentEntity } from './student.entity';

export interface GuardianType extends BaseEntityType {
  dni: string;
  name: string;
  phone: string;
  email?: string | null;
  occupation?: string | null;
  students?: StudentEntity[];
}

export class GuardianEntity
  extends BaseAggregateRootEntity<GuardianEntity>
  implements GuardianType
{
  @ApiProperty({ description: 'Documento Nacional de Identidad' })
  @IsString()
  @IsNotEmpty()
  dni: string;

  @ApiProperty({ description: 'Nombre completo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Número de teléfono de contacto' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Correo electrónico', required: false, nullable: true })
  @IsString()
  @IsOptional()
  email?: string | null;

  @ApiProperty({ description: 'Ocupación o profesión', required: false, nullable: true })
  @IsString()
  @IsOptional()
  occupation?: string | null;

  @ApiProperty({ type: () => [StudentEntity], required: false })
  students?: StudentEntity[];

  constructor(partial: Partial<GuardianType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
