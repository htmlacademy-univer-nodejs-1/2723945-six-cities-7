import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { ExceptionFilter } from './exception-filter.interface.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { Component } from '../../shared/types/index.js';
import { HttpError } from './http-error.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
  ) { }

  public catch(
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): void {
    if (error instanceof HttpError) {
      this.logger.error(error.message);

      res.status(error.statusCode).json({
        message: error.message,
      });

      return;
    }

    this.logger.error(error.message);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
    });
  }
}
