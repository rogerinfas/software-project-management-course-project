import { CourseEntity } from '../entities/course.entity';
import { PaginatedResult } from './prospect.repository.interface';

export interface ICourseRepository {
  create(course: Partial<CourseEntity>): Promise<CourseEntity>;
  findById(id: string): Promise<CourseEntity | null>;
  findByName(name: string): Promise<CourseEntity | null>;
  update(id: string, course: Partial<CourseEntity>): Promise<CourseEntity>;
  delete(id: string): Promise<void>;
  findManyPaginated(
    page: number,
    size: number,
    search?: string,
  ): Promise<PaginatedResult<CourseEntity>>;
  findAll(): Promise<CourseEntity[]>;
}
