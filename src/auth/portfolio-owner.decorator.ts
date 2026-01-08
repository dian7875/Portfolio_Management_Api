import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const PortfolioOwner = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if(!request.ownerId){
      throw new BadRequestException('No se encuentra el owner ID')
    }
    return request.ownerId;
  },
);
