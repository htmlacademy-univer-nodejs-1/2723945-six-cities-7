import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { Component } from '../../shared/types/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { UserService } from '../../shared/libs/services/index.js';
import { CreateUserDto, LoginUserDto } from '../../shared/libs/services/dto/index.js';
import { Controller } from './controller.js';
import { Route } from './route.interface.js';
import { Config, RestSchema } from '../../shared/libs/config/index.js';
import { createSHA256 } from '../../shared/helpers/index.js';
import { HttpError } from '../filters/http-error.js';

@injectable()
export class UserController extends Controller {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    super(logger);
  }

  public configureRoutes(): Route[] {
    return [
      {
        path: '/register',
        method: 'post',
        handler: async (req, res) => {
          const userDto = req.body as CreateUserDto;

          const existingUser = await this.userService.findByEmail(userDto.email);

          if (existingUser) {
            throw new HttpError(
              StatusCodes.CONFLICT,
              'User with this email already exists',
            );
          }

          const salt = this.config.get('salt');

          const user = await this.userService.create({
            ...userDto,
            password: createSHA256(userDto.password, salt),
          });

          this.created(res, {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            type: user.type,
            avatarUrl: user.avatarUrl,
          });
        },
      },
      {
        path: '/login',
        method: 'post',
        handler: async (req, res) => {
          const loginDto = req.body as LoginUserDto;
          const salt = this.config.get('salt');

          const user = await this.userService.verifyUser(
            loginDto.email,
            loginDto.password,
            salt,
          );

          if (!user) {
            throw new HttpError(
              StatusCodes.UNAUTHORIZED,
              'Invalid email or password',
            );
          }

          this.ok(res, { token: 'temporary-token' });
        },
      },
    ];
  }
}
