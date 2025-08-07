import { Module } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { TasksModule } from '../tasks/tasks.module';
import { FacialAuthModule } from '../../facial-auth/facial-auth.module';

@Module({
  imports: [
    TasksModule, 
    FacialAuthModule
  ],
  providers: [OrchestratorService],
  exports: [OrchestratorService],
})
export class OrchestratorServiceModule {} 