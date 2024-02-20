import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole } from 'src/database/entities/user.entity'
import { ROLES_KEY } from './roles.decorator'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RolesGuard implements CanActivate {
  private jwtSecret: string

  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService<envConfig>
  ) {
    jwtService = this.configService.getOrThrow('JWT_SECRET')
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    )

    if (!requiredRoles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      })
      request['user'] = payload
    } catch (error) {
      throw new UnauthorizedException()
    }

    const { user } = context.switchToHttp().getRequest()

    return requiredRoles.some((role) => user.role?.includes(role))
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
