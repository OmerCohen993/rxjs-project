import { Controller, Post, Body } from '@nestjs/common';
import { FacialAuthService } from './facial-auth.service';
import { FacialAuthParameters } from './models/facial-auth.model';
import { FacialAuthResult } from './types/facial-auth-result.type';

@Controller('facial-auth')
export class FacialAuthController {
  constructor(private readonly facialAuthService: FacialAuthService) {}

  @Post('compare')
  async compareStrings(@Body() facialAuthData: FacialAuthParameters): Promise<FacialAuthResult> {
    return this.facialAuthService.compareStrings(facialAuthData);
  }
}

