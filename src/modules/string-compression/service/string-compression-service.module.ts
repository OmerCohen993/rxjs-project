import { Module } from '@nestjs/common';
import { StringCompressionService } from './string-compression.service';

@Module({
  providers: [StringCompressionService],
  exports: [StringCompressionService],
})
export class StringCompressionServiceModule {} 