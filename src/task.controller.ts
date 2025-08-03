import { Controller, Get } from '@nestjs/common';
import { TaskOrchestratorService } from './task-orchestrator.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly orchestrator: TaskOrchestratorService) {}

  @Get('run')
  run() {
    return this.orchestrator.runAll();
  }
}