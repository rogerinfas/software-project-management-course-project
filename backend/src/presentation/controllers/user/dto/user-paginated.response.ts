import { ApiProperty } from '@nestjs/swagger';
import { BasePaginatedResponseDto } from '../../../../config/dtos/paginated-response.dto';
import { UserResponse } from './user.response';

export class ResponsePaginatedUserDto extends BasePaginatedResponseDto<UserResponse> {
  @ApiProperty({
    type: [UserResponse],
    description: 'Listado de usuarios paginados',
  })
  declare data: UserResponse[];
}
