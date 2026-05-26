import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UpdateAttendanceRulesDto {
  @ApiProperty({ description: 'Minutos de tolerancia globales' })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  gracePeriodMinutes: number;

  @ApiProperty({ description: 'Multa cobrada por minuto de tardanza' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  finePerMinute: number;
}
