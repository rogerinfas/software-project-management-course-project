import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ISectionRepository } from '../../../../domain/repositories/section.repository.interface';
import { SectionEntity } from '../../../../domain/entities/section.entity';

export class GetSectionsQuery implements IQuery {}

@QueryHandler(GetSectionsQuery)
export class GetSectionsQueryHandler implements IQueryHandler<GetSectionsQuery> {
  constructor(
    @Inject('ISectionRepository')
    private readonly repository: ISectionRepository,
  ) {}

  async execute(): Promise<SectionEntity[]> {
    return this.repository.findAll();
  }
}
