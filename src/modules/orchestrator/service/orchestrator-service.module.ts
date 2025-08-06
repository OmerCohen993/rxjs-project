import { Module } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { TasksModule } from '../tasks/tasks.module';
import { StringCompressionServiceModule } from '../../string-compression/service/string-compression-service.module';

@Module({
  imports: [TasksModule, StringCompressionServiceModule],
  providers: [OrchestratorService],
  exports: [OrchestratorService],
})
export class OrchestratorServiceModule {} 