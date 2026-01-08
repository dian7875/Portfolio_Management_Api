import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class PortfolioOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ownerId = request.headers['x-portfolio-owner'];

    if (!ownerId) {
      console.warn('X-Portfolio-Owner header no presente');
    }

    request.ownerId = ownerId;
    return true;
  }
}
