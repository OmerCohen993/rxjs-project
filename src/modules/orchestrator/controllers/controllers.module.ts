import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { OrchestratorServiceModule } from '../service/orchestrator-service.module';
import { OrchestratorService } from '../service/orchestrator.service';
import { StringCompressionServiceModule } from '../../string-compression/service/string-compression-service.module';

@Module({
  imports: [OrchestratorServiceModule, StringCompressionServiceModule],
  controllers: [TaskController],
  providers: [OrchestratorService],
})
export class ControllersModule {} 