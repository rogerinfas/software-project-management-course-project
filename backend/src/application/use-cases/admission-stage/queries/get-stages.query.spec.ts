import { GetStagesQuery, GetStagesQueryHandler } from './get-stages.query';
import { AdmissionStageEntity } from '../../../../domain/entities/admission-stage.entity';

describe('GetStagesQueryHandler', () => {
  let handler: GetStagesQueryHandler;
  let repository: any;

  beforeEach(() => {
    repository = {
      findAllWithProspects: jest.fn(),
    };
    handler = new GetStagesQueryHandler(repository);
  });

  it('should return all stages with prospects', async () => {
    const list = [new AdmissionStageEntity({ id: 's-1', name: 'Stage 1', order: 1 })];
    repository.findAllWithProspects.mockResolvedValue(list);

    const query = new GetStagesQuery();
    const result = await handler.execute(query);

    expect(result).toBe(list);
    expect(repository.findAllWithProspects).toHaveBeenCalled();
  });
});
