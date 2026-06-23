import { EnrollmentEntity } from '../entities/enrollment.entity';
import { PaginatedResult } from './prospect.repository.interface';

export interface IEnrollmentRepository {
  create(
    enrollment: Partial<EnrollmentEntity>,
  ): Promise<EnrollmentEntity>;
  findById(id: string): Promise<EnrollmentEntity | null>;
  findByStudentId(studentId: string): Promise<EnrollmentEntity[]>;
  findManyPaginated(
    page: number,
    size: number,
    search?: string,
  ): Promise<PaginatedResult<EnrollmentEntity>>;
  findAll(): Promise<EnrollmentEntity[]>;
}
