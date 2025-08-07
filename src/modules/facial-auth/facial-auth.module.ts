import { Module } from '@nestjs/common';
import { FacialAuthService } from './facial-auth.service';
import { FacialAuthController } from './facial-auth.controller';
import { FacialReconHttpModule } from '../../shared/http-consumer/facial-recon-http.module';

@Module({
  imports: [FacialReconHttpModule],
  controllers: [FacialAuthController],
  providers: [FacialAuthService],
  exports: [FacialAuthService],
})
export class FacialAuthModule {}

