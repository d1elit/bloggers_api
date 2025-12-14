import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { RequestWithBody } from '../../core/types/requestTypes';
import { LoginInput } from './input/login.input';
import { RegistrationInput } from './input/registration.input';
import { HttpStatus } from '../../core/types/http-statuses';
import { errorsHandler } from '../../core/errors/errors.handler';
import { AuthService } from '../application/auth.service';
import { UsersQueryRepository } from '../../users/infrastructure/repositories/users.query-repository';

@injectable()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async login(req: RequestWithBody<LoginInput>, res: Response) {
    try {
      const deviceName =
        req.headers['user-agent']?.split('/')[0] || 'unknown device';
      const ip = req.socket.remoteAddress || req.ip || 'unknown ip';

      const [accessToken, refreshToken] = await this.authService.auth({
        loginDto: req.body,
        ip,
        deviceName,
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
      });
      res.status(HttpStatus.Ok).send({ accessToken: accessToken });
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async registration(req: RequestWithBody<RegistrationInput>, res: Response) {
    try {
      await this.authService.register(req.body);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async registrationConfirmation(
    req: RequestWithBody<{ code: string }>,
    res: Response,
  ) {
    try {
      await this.authService.registrationConfirmation(req.body.code);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async emailResending(req: RequestWithBody<{ email: string }>, res: Response) {
    try {
      await this.authService.emailResending(req.body.email);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async getAuthMe(req: Request, res: Response) {
    try {
      const userId = req.user?.userId as string;
      if (!userId) return res.sendStatus(HttpStatus.Unauthorized);
      const me = await this.usersQueryRepository.findByIdOrError(userId);
      const meView = {
        email: me?.email,
        login: me?.login,
        userId: me?._id.toString(),
      };
      return res.status(HttpStatus.Ok).send(meView);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      console.log('REFRESHIKKKKK');
      const { userId, deviceId } = req.user!;
      const token = req.cookies.refreshToken;
      const [accessToken, refreshToken] = await this.authService.refreshToken(
        token,
        userId,
        deviceId,
      );
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
      });
      res.status(HttpStatus.Ok).send({ accessToken: accessToken });
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const token = req.cookies.refreshToken;
      await this.authService.logout(token);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async passwordRecovery(
    req: RequestWithBody<{ email: string }>,
    res: Response,
  ) {
    try {
      await this.authService.passwordRecovery(req.body.email);
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async newPassword(
    req: RequestWithBody<{ recoveryCode: string; newPassword: string }>,
    res: Response,
  ) {
    try {
      const code = req.body.recoveryCode;
      const password = req.body.newPassword;
      await this.authService.passwordRecoveryConfirmation({
        code,
        password,
      });
      res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }
}
