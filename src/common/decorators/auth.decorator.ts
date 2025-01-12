import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

export function RequiredAuth(optional: boolean = false) {
  return applyDecorators(
    SetMetadata('optionalAuth', optional),
    ApiBearerAuth('Authorization'),
    UseGuards(AuthGuard),
  );
}
