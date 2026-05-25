import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseAggregateRootEntity } from '../../config/entities/base-entities/blacklist-strategy/base.entity';
import { BaseEntityType } from '../../config/entities/base-entities/base-entity.types';
import { StudentEntity } from './student.entity';
import { TariffEntity } from './tariff.entity';

export interface ChargeModelType extends BaseEntityType {
  studentId: string;
  student?: StudentEntity | null;
  tariffId: string;
  tariff?: TariffEntity | null;
  originalAmount: number;
  pendingAmount: number;
  dueDate?: Date | null;
  status: string;
}

export class ChargeEntity
  extends BaseAggregateRootEntity<ChargeEntity>
  implements ChargeModelType
{
  @ApiProperty({ description: 'ID del estudiante' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ type: () => StudentEntity, required: false, nullable: true })
  student?: StudentEntity | null;

  @ApiProperty({ description: 'ID de la tarifa asociada' })
  @IsString()
  @IsNotEmpty()
  tariffId: string;

  @ApiProperty({ type: () => TariffEntity, required: false, nullable: true })
  tariff?: TariffEntity | null;

  @ApiProperty({ description: 'Monto original del cargo' })
  @IsNumber()
  @IsNotEmpty()
  originalAmount: number;

  @ApiProperty({ description: 'Monto pendiente por pagar' })
  @IsNumber()
  @IsNotEmpty()
  pendingAmount: number;

  @ApiProperty({ description: 'Fecha de vencimiento', required: false, nullable: true })
  @IsDate()
  @IsOptional()
  dueDate?: Date | null;

  @ApiProperty({ description: 'Estado del cargo (PENDING, PARTIAL, PAID)' })
  @IsString()
  @IsNotEmpty()
  status: string;

  constructor(partial: Partial<ChargeModelType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
