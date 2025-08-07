import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { OrchestratorServiceModule } from '../service/orchestrator-service.module';
import { StringCompressionServiceModule } from '../../string-compression/service/string-compression-service.module';
import { StringUpperClassServiceModule } from '../../string-upper-class/service/string-upper-class-service.module';

@Module({
  imports: [OrchestratorServiceModule, StringCompressionServiceModule, StringUpperClassServiceModule],
  controllers: [TaskController],
})
export class ControllersModule {} 