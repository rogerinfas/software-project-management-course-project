import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ProspectResponse } from './prospect.response';

export class AdmissionStageResponse {
  @ApiProperty({
    description: 'Unique stage identifier',
    example: 'stage-123',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Stage name',
    example: 'Entrevista',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Display order',
    example: 1,
  })
  @Expose()
  order: number;

  @ApiProperty({
    description: 'List of prospects currently in this stage',
    type: () => [ProspectResponse],
    required: false,
  })
  @Expose()
  @Type(() => ProspectResponse)
  prospects?: ProspectResponse[];

  @ApiProperty({
    description: 'Creation date',
    example: new Date().toISOString(),
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: new Date().toISOString(),
  })
  @Expose()
  updatedAt: Date;
}
