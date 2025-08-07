// src/orchestrator/controllers/task.controller.ts
import { Controller, Get, Param, HttpException, HttpStatus, Query } from '@nestjs/common';
import { OrchestratorService } from '../service/orchestrator.service';
import { TaskResult } from '../tasks/types/task-result.interface';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface TaskRunParams {
  id?: string;
  idVerification?: string;
}

@Controller('tasks')
export class TaskController {
  constructor(private readonly orchestrator: OrchestratorService) {}

  @Get('run')
  runAll(@Query() params: TaskRunParams): Observable<TaskResult[]> {
    const { id, idVerification } = params;
    
    if (!id || !idVerification) {
      throw new HttpException(
        'Both id and idVerification parameters are required',
        HttpStatus.BAD_REQUEST
      );
    }

    // Convert to the expected format
    const facialAuthParams = { stringA: id, stringB: idVerification };

    return this.orchestrator.runAll(facialAuthParams).pipe(
      catchError(err => {
        throw new HttpException(
          `Orchestration failed: ${err.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      })
    );
  }

  @Get('run/final')
  runAllFinal(@Query() params: TaskRunParams): Observable<any> {
    const { id, idVerification } = params;
    
    if (!id || !idVerification) {
      throw new HttpException(
        'Both id and idVerification parameters are required',
        HttpStatus.BAD_REQUEST
      );
    }

    // Convert to the expected format
    const facialAuthParams = { stringA: id, stringB: idVerification };

    return this.orchestrator.runAllFinal(facialAuthParams).pipe(
      catchError(err => {
        throw new HttpException(
          `Orchestration failed: ${err.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      })
    );
  }

  @Get('run/:taskName')
  runSingleTask(
    @Param('taskName') taskName: string,
    @Query() params: TaskRunParams
  ): Observable<TaskResult> {
    const { id, idVerification } = params;
    
    if (!id || !idVerification) {
      throw new HttpException(
        'Both id and idVerification parameters are required',
        HttpStatus.BAD_REQUEST
      );
    }

    // Convert to the expected format
    const facialAuthParams = { stringA: id, stringB: idVerification };

    return this.orchestrator.runTask(taskName, facialAuthParams).pipe(
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