import { Module } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [TasksModule],
  providers: [OrchestratorService],
  exports: [OrchestratorService],
})
export class OrchestratorServiceModule {} 