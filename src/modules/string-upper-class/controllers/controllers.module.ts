import { Module } from '@nestjs/common';
import { StringUpperClassController } from './string-upper-class.controller';
import { StringUpperClassServiceModule } from '../service/string-upper-class-service.module';
import { StringUpperClassService } from '../service/string-upper-class.service';

@Module({
  imports: [StringUpperClassServiceModule],
  controllers: [StringUpperClassController],
  providers: [StringUpperClassService],
})
export class ControllersModule {} 