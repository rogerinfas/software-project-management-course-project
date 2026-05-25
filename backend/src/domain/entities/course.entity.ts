import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseAggregateRootEntity } from '../../config/entities/base-entities/blacklist-strategy/base.entity';
import { BaseEntityType } from '../../config/entities/base-entities/base-entity.types';

export interface CourseType extends BaseEntityType {
  name: string;
  description?: string | null;
}

export class CourseEntity
  extends BaseAggregateRootEntity<CourseEntity>
  implements CourseType
{
  @ApiProperty({ description: 'Nombre del curso' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Descripción opcional del curso', required: false, nullable: true })
  @IsString()
  @IsOptional()
  description?: string | null;

  constructor(partial: Partial<CourseType>) {
    super(partial);
    Object.assign(this, partial);
  }
}
