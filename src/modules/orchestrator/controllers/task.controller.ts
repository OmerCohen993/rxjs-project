// src/orchestrator/controllers/task.controller.ts
import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { OrchestratorService } from '../service/orchestrator.service';
import { TaskResult } from '../tasks/types/task-result.interface';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Controller('tasks')
export class TaskController {
  constructor(private readonly orchestrator: OrchestratorService) {}

  @Get('run')
  runAll(): Observable<TaskResult[]> {
    return this.orchestrator.runAll().pipe(
      catchError(err => {
        throw new HttpException(
          `Orchestration failed: ${err.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      })
    );
  }

  @Get('run/:taskName')
  runSingleTask(@Param('taskName') taskName: string): Observable<TaskResult> {
    return this.orchestrator.runTask(taskName).pipe(
      catchError(err => {
        throw new HttpException(
          `Task ${taskName} failed: ${err.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      })
    );
  }

  @Get('info')
  getTaskInfo() {
    return this.orchestrator.getTaskInfo();
  }
} 