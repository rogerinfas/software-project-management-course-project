import { GetInteractionsQuery, GetInteractionsQueryHandler } from './get-interactions.query';
import { ProspectInteractionEntity } from '../../../../domain/entities/interaction.entity';
import { NotFoundException } from '@nestjs/common';

describe('GetInteractionsQueryHandler', () => {
  let handler: GetInteractionsQueryHandler;
  let repository: any;
  let prospectRepository: any;

  beforeEach(() => {
    repository = {
      findByProspectId: jest.fn(),
    };
    prospectRepository = {
      findById: jest.fn(),
    };
    handler = new GetInteractionsQueryHandler(repository, prospectRepository);
  });

  it('should throw NotFoundException if prospect not found', async () => {
    prospectRepository.findById.mockResolvedValue(null);
    const query = new GetInteractionsQuery('p-1');

    await expect(handler.execute(query)).rejects.toThrow(NotFoundException);
  });

  it('should return interactions if prospect found', async () => {
    prospectRepository.findById.mockResolvedValue({});
    const list = [new ProspectInteractionEntity({ id: 'i-1', prospectId: 'p-1', type: 'Call', summary: 'Called', author: 'Admin', date: new Date() })];
    repository.findByProspectId.mockResolvedValue(list);

    const query = new GetInteractionsQuery('p-1');
    const result = await handler.execute(query);

    expect(result).toBe(list);
    expect(repository.findByProspectId).toHaveBeenCalledWith('p-1');
  });
});
