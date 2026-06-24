import { SECTION_REPOSITORY } from '../../../../config/constants/tokens';
import { USER_REPOSITORY } from '../../../../config/constants/tokens';
import { TARIFF_REPOSITORY } from '../../../../config/constants/tokens';
import { STUDENT_REPOSITORY } from '../../../../config/constants/tokens';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import type { ISectionRepository } from '../../../../domain/repositories/section.repository.interface';
import { SectionEntity } from '../../../../domain/entities/section.entity';

export class GetSectionsQuery implements IQuery {}

@QueryHandler(GetSectionsQuery)
export class GetSectionsQueryHandler implements IQueryHandler<GetSectionsQuery> {
  constructor(
    @Inject(SECTION_REPOSITORY)
    private readonly repository: ISectionRepository,
  ) {}

  async execute(): Promise<SectionEntity[]> {
    return this.repository.findAll();
  }
}
