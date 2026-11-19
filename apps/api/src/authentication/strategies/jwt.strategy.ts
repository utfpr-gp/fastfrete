import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthorizationService } from '../../authorization/authorization.service';
import type { CurrentUserData } from '../../authorization/decorators/current-user.decorator';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authorizationService: AuthorizationService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    });
  }

  async validate(payload: JwtPayload): Promise<CurrentUserData> {
    const userData = await this.authorizationService.getUserAuthorizationData(
      payload.sub,
    );

    if (!userData) {
      throw new UnauthorizedException('User not found');
    }

    return userData;
  }
}
