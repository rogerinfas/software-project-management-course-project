import { ApiProperty } from '@nestjs/swagger';

export class BaseErrorResponse {
  @ApiProperty({
    description: 'HTTP Status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Bad Request',
  })
  message: string;

  @ApiProperty({
    description: 'Error details or array of validation errors',
    example: ['email must be an email'],
    required: false,
  })
  error?: string | string[];

  @ApiProperty({
    description: 'Timestamp when the error occurred',
    example: new Date().toISOString(),
  })
  timestamp: string;

  @ApiProperty({
    description: 'Path where the error occurred',
    example: '/api/users',
  })
  path: string;
}
