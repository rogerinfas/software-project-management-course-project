import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { BaseAggregateRootEntity } from '../../config/entities/base-entities/blacklist-strategy/base.entity';
import { BaseEntityType } from '../../config/entities/base-entities/base-entity.types';
import { StaffProfileEntity } from './staff-profile.entity';

export interface AttendanceRecordType extends BaseEntityType {
  staffId: string;
  staff?: StaffProfileEntity | null;
  type: string;
  timestamp: Date;
  method: string;
  delayMinutes: number;
  fineAmount: number;
}

export class AttendanceRecordEntity
  extends BaseAggregateRootEntity<AttendanceRecordEntity>
  implements AttendanceRecordType
{
  @ApiProperty({ description: 'ID de perfil de personal' })
  @IsString()
  @IsNotEmpty()
  staffId: string;

  @ApiProperty({ type: () => StaffProfileEntity, required: false, nullable: true })
  staff?: StaffProfileEntity | null;

  @ApiProperty({ description: 'Tipo de marcación (entry, exit)' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Timestamp de marcación' })
  @IsDate()
  @IsNotEmpty()
  timestamp: Date;

  @ApiProperty({ description: 'Método de marcación', default: 'FACIAL' })
  @IsString()
  @IsNotEmpty()
  method: string;

  @ApiProperty({ description: 'Minutos de tardanza calculados', default: 0 })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  delayMinutes: number;

  @ApiProperty({ description: 'Monto de multa calculado', default: 0.0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  fineAmount: number;

  constructor(partial: Partial<AttendanceRecordType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
