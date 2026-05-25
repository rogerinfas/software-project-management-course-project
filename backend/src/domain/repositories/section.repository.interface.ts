import { SectionEntity } from '../entities/section.entity';

export abstract class ISectionRepository {
  abstract findById(id: string): Promise<SectionEntity | null>;
  abstract findAll(): Promise<SectionEntity[]>;
  abstract update(
    id: string,
    section: Partial<SectionEntity>,
  ): Promise<SectionEntity>;
}
