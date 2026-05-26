import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseAggregateRootEntity } from '../../config/entities/base-entities/blacklist-strategy/base.entity';
import { BaseEntityType } from '../../config/entities/base-entities/base-entity.types';
import { TariffType, EducationalLevel } from '@prisma/client';

export interface TariffModelType extends BaseEntityType {
  concept: string;
  amount: number;
  type: TariffType;
  level: EducationalLevel;
}

export class TariffEntity
  extends BaseAggregateRootEntity<TariffEntity>
  implements TariffModelType
{
  @ApiProperty({ description: 'Concepto de la tarifa' })
  @IsString()
  @IsNotEmpty()
  concept: string;

  @ApiProperty({ description: 'Monto de la tarifa' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ enum: TariffType, description: 'Tipo de tarifa' })
  @IsEnum(TariffType)
  @IsNotEmpty()
  type: TariffType;

  @ApiProperty({ enum: EducationalLevel, description: 'Nivel educativo asignado' })
  @IsEnum(EducationalLevel)
  @IsNotEmpty()
  level: EducationalLevel;

  constructor(partial: Partial<TariffModelType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
