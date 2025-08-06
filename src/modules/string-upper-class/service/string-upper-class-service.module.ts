import { Module } from '@nestjs/common';
import { StringUpperClassService } from './string-upper-class.service';

@Module({
  providers: [StringUpperClassService],
  exports: [StringUpperClassService],
})
export class StringUpperClassServiceModule {} 