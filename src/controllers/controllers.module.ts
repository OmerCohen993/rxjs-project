import { Module } from '@nestjs/common';
import { TaskController } from './controller';
import { OrchestratorModule } from '../orchestrator/orchestrator.module';
import { OrchestratorService } from '../orchestrator/orchestrator.service';

@Module({
  imports: [OrchestratorModule],
  controllers: [TaskController],
  providers: [OrchestratorService],
})
export class ControllersModule {} 