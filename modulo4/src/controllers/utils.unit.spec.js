import { logger } from '@/utils/logger';
import { StatusCodes } from 'http-status-codes';
import { buildRes } from 'test/builders';
import { validationResponse } from './utils';

jest.mock('@/utils/logger');

describe('Controllers > utils', () => {
  it('should call res.status and res.json with proper data', () => {
    const res = buildRes();
    const errorBag = ['error1', 'error2'];
    const errorsMock = {
      array: jest.fn().mockReturnValueOnce(errorBag).mockName('errors.array()'),
    };

    validationResponse(res, errorsMock);

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith('Validation failure', {
      errors: errorBag,
    });
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      errors: errorBag,
    });
    expect(errorsMock.array).toHaveBeenCalledTimes(1);
  });
});
