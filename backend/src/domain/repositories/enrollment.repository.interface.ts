import { EnrollmentEntity } from '../entities/enrollment.entity';
import { PaginatedResult } from './prospect.repository.interface';

export abstract class IEnrollmentRepository {
  abstract create(enrollment: Partial<EnrollmentEntity>): Promise<EnrollmentEntity>;
  abstract findById(id: string): Promise<EnrollmentEntity | null>;
  abstract findByStudentId(studentId: string): Promise<EnrollmentEntity[]>;
  abstract findManyPaginated(
    page: number,
    size: number,
    search?: string,
  ): Promise<PaginatedResult<EnrollmentEntity>>;
  abstract findAll(): Promise<EnrollmentEntity[]>;
}
