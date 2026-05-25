import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseAggregateRootEntity } from '../../config/entities/base-entities/blacklist-strategy/base.entity';
import { BaseEntityType } from '../../config/entities/base-entities/base-entity.types';
import { PaymentMethod } from '@prisma/client';
import { ChargeEntity } from './charge.entity';

export interface PaymentModelType extends BaseEntityType {
  chargeId: string;
  charge?: ChargeEntity | null;
  studentId: string;
  totalAmount: number;
  method: PaymentMethod;
  timestamp: Date;
}

export class PaymentEntity
  extends BaseAggregateRootEntity<PaymentEntity>
  implements PaymentModelType
{
  @ApiProperty({ description: 'ID del cargo asociado' })
  @IsString()
  @IsNotEmpty()
  chargeId: string;

  @ApiProperty({ type: () => ChargeEntity, required: false, nullable: true })
  charge?: ChargeEntity | null;

  @ApiProperty({ description: 'ID del estudiante' })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ description: 'Monto total pagado' })
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @ApiProperty({ enum: PaymentMethod, description: 'Método de pago' })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  method: PaymentMethod;

  @ApiProperty({ description: 'Fecha y hora de la transacción' })
  @IsDate()
  @IsNotEmpty()
  timestamp: Date;

  constructor(partial: Partial<PaymentModelType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
