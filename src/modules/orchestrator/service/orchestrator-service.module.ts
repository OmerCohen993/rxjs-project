import { Module } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { TasksModule } from '../tasks/tasks.module';
import { FacialAuthModule } from '../../facial-auth/facial-auth.module';
import { FacialReconHttpModule } from '../../../shared/http-consumer/facial-recon-http.module';

@Module({
  imports: [
    TasksModule, 
    FacialAuthModule,
    FacialReconHttpModule
  ],
  providers: [OrchestratorService],
  exports: [OrchestratorService],
})
export class OrchestratorServiceModule {} 