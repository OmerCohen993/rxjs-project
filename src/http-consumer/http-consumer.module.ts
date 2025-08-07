import { Module } from '@nestjs/common';
import { HttpConsumerService } from './http-consumer.service';

@Module({
  providers: [HttpConsumerService],
  exports: [HttpConsumerService],
})
export class HttpConsumerModule {}

