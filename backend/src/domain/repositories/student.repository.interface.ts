import { StudentEntity } from '../entities/student.entity';
import { PaginatedResult } from './prospect.repository.interface';

export abstract class IStudentRepository {
  abstract create(student: Partial<StudentEntity>): Promise<StudentEntity>;
  abstract findById(id: string): Promise<StudentEntity | null>;
  abstract findByDni(dni: string): Promise<StudentEntity | null>;
  abstract update(
    id: string,
    student: Partial<StudentEntity>,
  ): Promise<StudentEntity>;
  abstract findManyPaginated(
    page: number,
    size: number,
    search?: string,
  ): Promise<PaginatedResult<StudentEntity>>;
  abstract findAll(): Promise<StudentEntity[]>;
}
