import { Module } from '@nestjs/common';
import { StringCompressionController } from './string-compression.controller';
import { StringCompressionServiceModule } from '../service/string-compression-service.module';
import { StringCompressionService } from '../service/string-compression.service';

@Module({
  imports: [StringCompressionServiceModule],
  controllers: [StringCompressionController],
  providers: [StringCompressionService],
})
export class ControllersModule {} 