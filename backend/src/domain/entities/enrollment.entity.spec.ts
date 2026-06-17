import { EnrollmentEntity } from './enrollment.entity';

describe('EnrollmentEntity', () => {
  it('should create an EnrollmentEntity instance and populate fields', () => {
    const data = {
      id: 'enroll-1',
      studentId: 'student-1',
      year: 2026,
      date: new Date(),
      status: 'ACTIVE',
      pdfUrl: 'http://test.com/pdf',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const entity = new EnrollmentEntity(data);

    expect(entity.id).toBe(data.id);
    expect(entity.studentId).toBe(data.studentId);
    expect(entity.year).toBe(data.year);
    expect(entity.date).toBe(data.date);
    expect(entity.status).toBe(data.status);
    expect(entity.pdfUrl).toBe(data.pdfUrl);
  });
});
