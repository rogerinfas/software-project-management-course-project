import { StudentEntity } from '../entities/student.entity';
import { PaginatedResult } from './prospect.repository.interface';

export interface IStudentRepository {
  create(student: Partial<StudentEntity>): Promise<StudentEntity>;
  findById(id: string): Promise<StudentEntity | null>;
  findByDni(dni: string): Promise<StudentEntity | null>;
  update(id: string, student: Partial<StudentEntity>): Promise<StudentEntity>;
  findManyPaginated(
    page: number,
    size: number,
    search?: string,
  ): Promise<PaginatedResult<StudentEntity>>;
  findAll(): Promise<StudentEntity[]>;
}
