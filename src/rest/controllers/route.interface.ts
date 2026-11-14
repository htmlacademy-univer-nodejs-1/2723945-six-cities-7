import { NextFunction, Request, Response } from 'express';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface Route {
  path: string;
  method: HttpMethod;
  handler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
}
