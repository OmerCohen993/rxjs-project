import { Controller, Get } from '@nestjs/common';
import { OrchestratorService } from '../orchestrator/orchestrator.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly orchestrator: OrchestratorService) {}

  @Get('run')
  run() {
    return this.orchestrator.runAll();
  }
} 