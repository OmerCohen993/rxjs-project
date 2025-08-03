import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskOrchestratorService } from './task-orchestrator.service';

@Module({
  imports: [],
  controllers: [TaskController],
  providers: [TaskOrchestratorService],
})
export class AppModule {}