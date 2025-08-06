import { Module } from '@nestjs/common';
import { ControllersModule } from './controllers/controllers.module';

@Module({
  imports: [ControllersModule],
  exports: [ControllersModule],
})
export class StringCompressionModule {} 