import { CourseEntity } from '../entities/course.entity';
import { PaginatedResult } from './prospect.repository.interface';

export abstract class ICourseRepository {
  abstract create(course: Partial<CourseEntity>): Promise<CourseEntity>;
  abstract findById(id: string): Promise<CourseEntity | null>;
  abstract findByName(name: string): Promise<CourseEntity | null>;
  abstract update(id: string, course: Partial<CourseEntity>): Promise<CourseEntity>;
  abstract delete(id: string): Promise<void>;
  abstract findManyPaginated(
    page: number,
    size: number,
    search?: string,
  ): Promise<PaginatedResult<CourseEntity>>;
  abstract findAll(): Promise<CourseEntity[]>;
}
