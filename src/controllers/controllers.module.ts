import { Module } from '@nestjs/common';
import { TaskController } from './controller';
import { OrchestratorModule } from '../orchestrator/orchestrator.module';

@Module({
  imports: [OrchestratorModule],
  controllers: [TaskController],
})
export class ControllersModule {} 