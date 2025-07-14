import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants/jwt.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlacklistedToken } from '../entities/blacklisted-token.entity';
import { ActiveToken } from '../entities/active-token.entity';

interface JwtPayload {
  sub: number;
  username: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(ActiveToken)
    private readonly activeTokenRepository: Repository<ActiveToken>,
    @InjectRepository(BlacklistedToken)
    private readonly blacklistTokenRepository: Repository<BlacklistedToken>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) {
      throw new UnauthorizedException('Token no encontrado');
    }

    const blacklistedToken = await this.blacklistTokenRepository.findOne({
      where: { token },
    });

    if (blacklistedToken) {
      throw new UnauthorizedException('Token revocado');
    }

    const activeToken = await this.activeTokenRepository.findOne({
      where: { email: payload.email, token },
    });

    if (!activeToken) {
      throw new UnauthorizedException('Token inválido');
    }

    return {
      sub: payload.sub,
      username: payload.username,
      email: payload.email,
    };
  }
}
