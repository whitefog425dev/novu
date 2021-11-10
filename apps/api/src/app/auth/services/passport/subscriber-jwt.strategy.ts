import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IJwtPayload, ISubscriberJwt } from '@notifire/shared';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtSubscriberStrategy extends PassportStrategy(Strategy, 'subscriberJwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: ISubscriberJwt) {
    const subscriber = await this.authService.validateSubscriber(payload);

    if (!subscriber) {
      throw new UnauthorizedException();
    }

    if (payload.aud !== 'widget_user') {
      throw new UnauthorizedException();
    }

    return subscriber;
  }
}
