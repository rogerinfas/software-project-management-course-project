import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { BaseAggregateRootEntity } from '../../config/entities/base-entities/blacklist-strategy/base.entity';
import { BaseEntityType } from '../../config/entities/base-entities/base-entity.types';

export interface AttendanceRuleType extends BaseEntityType {
  gracePeriodMinutes: number;
  finePerMinute: number;
}

export class AttendanceRuleEntity
  extends BaseAggregateRootEntity<AttendanceRuleEntity>
  implements AttendanceRuleType
{
  @ApiProperty({ description: 'Minutos de gracia permitidos globalmente', default: 5 })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  gracePeriodMinutes: number;

  @ApiProperty({ description: 'Monto de multa cobrado por minuto de tardanza', default: 0.5 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  finePerMinute: number;

  constructor(partial: Partial<AttendanceRuleType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
