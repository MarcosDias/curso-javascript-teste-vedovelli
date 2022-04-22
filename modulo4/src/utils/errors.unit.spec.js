import createError from 'http-errors';
import { appError } from './errors';
import { logger } from './logger';
import { StatusCodes } from 'http-status-codes';

jest.mock('./logger');
jest.mock('http-errors');

describe('Utils > Errors', () => {
  const errorMessage = 'Error message';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should execute logger.error', () => {
    appError(errorMessage);

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(errorMessage);
  });

  it('should execute createError with message and default status code', () => {
    appError(errorMessage);

    expect(createError).toHaveBeenCalledTimes(1);
    expect(createError).toHaveBeenCalledWith(
      StatusCodes.INTERNAL_SERVER_ERROR,
      errorMessage,
    );
  });

  it('should execute createError with message and provided status code', () => {
    appError(errorMessage, StatusCodes.UNPROCESSABLE_ENTITY);

    expect(createError).toHaveBeenCalledTimes(1);
    expect(createError).toHaveBeenCalledWith(
      StatusCodes.UNPROCESSABLE_ENTITY,
      errorMessage,
    );
  });
});
