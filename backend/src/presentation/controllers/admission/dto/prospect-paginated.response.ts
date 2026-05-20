import { ApiProperty } from '@nestjs/swagger';
import { ProspectResponse } from './prospect.response';

export class PaginationMeta {
  @ApiProperty({ example: 50 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 15 })
  size: number;

  @ApiProperty({ example: 4 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNext: boolean;
}

export class ResponsePaginatedProspectDto {
  @ApiProperty({ type: [ProspectResponse] })
  data: ProspectResponse[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}
