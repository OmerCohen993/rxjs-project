import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { OrchestratorServiceModule } from '../service/orchestrator-service.module';
import { OrchestratorService } from '../service/orchestrator.service';

@Module({
  imports: [OrchestratorServiceModule],
  controllers: [TaskController],
  providers: [OrchestratorService],
})
export class ControllersModule {} 