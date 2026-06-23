import { SectionEntity } from '../entities/section.entity';

export interface ISectionRepository {
  create(section: Partial<SectionEntity>): Promise<SectionEntity>;
  findById(id: string): Promise<SectionEntity | null>;
  findAll(): Promise<SectionEntity[]>;
  update(id: string, section: Partial<SectionEntity>): Promise<SectionEntity>;
  delete(id: string): Promise<void>;
}
