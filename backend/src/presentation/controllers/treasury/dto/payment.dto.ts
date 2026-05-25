import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';
import { ChargeResponse } from './charge.dto';

export class RegisterPaymentDto {
  @ApiProperty({ description: 'ID del cargo a pagar', example: 'charge-123' })
  @IsString()
  @IsNotEmpty()
  chargeId: string;

  @ApiProperty({ description: 'Monto total a pagar', example: 150.0 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ enum: PaymentMethod, description: 'Método de pago', example: PaymentMethod.CASH })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  method: PaymentMethod;
}

export class PaymentResponse {
  @ApiProperty({ description: 'ID de la transacción de pago', example: 'payment-123' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'ID del cargo asociado', example: 'charge-123' })
  @Expose()
  chargeId: string;

  @ApiProperty({ type: () => ChargeResponse, required: false })
  @Expose()
  charge?: ChargeResponse;

  @ApiProperty({ description: 'ID del estudiante', example: 'student-123' })
  @Expose()
  studentId: string;

  @ApiProperty({ description: 'Monto pagado', example: 150.0 })
  @Expose()
  totalAmount: number;

  @ApiProperty({ enum: PaymentMethod, description: 'Método de pago' })
  @Expose()
  method: PaymentMethod;

  @ApiProperty({ description: 'Fecha y hora de pago', example: '2026-05-25T00:00:00.000Z' })
  @Expose()
  timestamp: Date;
}
