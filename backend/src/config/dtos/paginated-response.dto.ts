import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetadata, PaginatedResult } from '../interfaces/pagination.interface';

export class PaginationMetadataDto implements PaginationMetadata {
  @ApiProperty({ type: Number, description: 'Número total de elementos' })
  total: number;

  @ApiProperty({ type: Number, description: 'Número de página actual' })
  page: number;

  @ApiProperty({ type: Number, description: 'Cantidad de elementos por página' })
  pageSize: number;

  @ApiProperty({ type: Number, description: 'Número total de páginas' })
  totalPages: number;

  @ApiProperty({ type: Boolean, description: 'Indica si existe una página siguiente' })
  hasNext: boolean;

  @ApiProperty({ type: Boolean, description: 'Indica si existe una página anterior' })
  hasPrevious: boolean;
}

export abstract class BasePaginatedResponseDto<T> implements PaginatedResult<T> {
  @ApiProperty({ type: [Object], description: 'Listado de elementos de datos' })
  data: T[];

  @ApiProperty({
    type: PaginationMetadataDto,
    description: 'Metadatos de paginación',
  })
  meta: PaginationMetadataDto;
}
