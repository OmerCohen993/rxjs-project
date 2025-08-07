import { Module } from '@nestjs/common';
import { HttpConsumerModule } from './http-consumer.module';
import { HttpConsumerService } from './http-consumer.service';

export class FacialRecoService extends HttpConsumerService {}

@Module({
  imports: [
    HttpConsumerModule
  ],
  providers: [
    {
      provide: FacialRecoService, 
      useExisting: HttpConsumerService
    }
  ],
  exports: [FacialRecoService]
})
export class FacialReconHttpModule {}
