import { Test, TestingModule } from '@nestjs/testing';
import { PrismaAppointmentRepository } from './prisma-appointment.repository';
import { PrismaService } from '../prisma.service';
import { AppointmentEntity } from '../../../../domain/entities/appointment.entity';

describe('PrismaAppointmentRepository', () => {
  let repository: PrismaAppointmentRepository;

  const mockPrisma = {
    appointment: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaAppointmentRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repository = module.get<PrismaAppointmentRepository>(PrismaAppointmentRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an appointment', async () => {
    const date = new Date();
    mockPrisma.appointment.create.mockResolvedValue({ id: 'app-1', prospectId: 'p-1', date, type: 'Interview', notes: 'N', prospect: {} });

    const result = await repository.create({ prospectId: 'p-1', date, type: 'Interview', notes: 'N' });

    expect(result).toBeInstanceOf(AppointmentEntity);
    expect(result.id).toBe('app-1');
  });

  it('should find all appointments', async () => {
    mockPrisma.appointment.findMany.mockResolvedValue([{ id: 'app-1', prospect: {} }]);

    const result = await repository.findAll();

    expect(result).toHaveLength(1);
  });
});
