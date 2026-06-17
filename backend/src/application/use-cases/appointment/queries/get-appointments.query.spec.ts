import { GetAppointmentsQuery, GetAppointmentsQueryHandler } from './get-appointments.query';
import { AppointmentEntity } from '../../../../domain/entities/appointment.entity';

describe('GetAppointmentsQueryHandler', () => {
  let handler: GetAppointmentsQueryHandler;
  let repository: any;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
    };
    handler = new GetAppointmentsQueryHandler(repository);
  });

  it('should return all appointments', async () => {
    const list = [new AppointmentEntity({ id: 'app-1', prospectId: 'p-1', date: new Date(), type: 'Interview' })];
    repository.findAll.mockResolvedValue(list);

    const query = new GetAppointmentsQuery();
    const result = await handler.execute(query);

    expect(result).toBe(list);
    expect(repository.findAll).toHaveBeenCalled();
  });
});
