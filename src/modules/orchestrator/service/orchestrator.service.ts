// src/orchestrator/service/orchestrator.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { from, forkJoin, Observable, of, throwError } from 'rxjs';
import {
  mergeMap,
  concatMap,
  shareReplay,
  catchError,
  toArray,
  map,
} from 'rxjs/operators';
import * as toposort from 'toposort';
import { Task, tasks } from '../tasks/index';
import { TaskResult } from '../tasks/types/task-result.interface';
import { initializeTasks } from './utils/task-initializer.util';
import { StringCompressionService } from '../../string-compression/service/string-compression.service';
import { StringUpperClassService } from '../../string-upper-class/service/string-upper-class.service';
import { createTaskA } from '../tasks/task-a';
import { createTaskB } from '../tasks/task-b';
import { taskC, taskD, taskE } from '../tasks/index';

@Injectable()
export class OrchestratorService implements OnModuleInit {
  private order: string[] = [];
  private taskMap = new Map<string, Task>();

  constructor(
    private readonly stringCompressionService: StringCompressionService,
    private readonly stringUpperClassService: StringUpperClassService
  ) {}

  onModuleInit() {
    // Create task instances with dependency injection
    const taskA = createTaskA(this.stringCompressionService);
    const taskB = createTaskB(this.stringUpperClassService);
    const allTasks = [taskA, taskB, taskC, taskD, taskE];
    
    this.order = initializeTasks(allTasks, this.taskMap);
  }

  runAll(initialInput: { id: string; idVerification: string }): Observable<TaskResult[]> {
    const cache = new Map<string, Observable<TaskResult>>();
    const accumulatedData = new Map<string, any>();

    return from(this.order).pipe(
      concatMap(name => this.runTaskInternal(name, cache, initialInput, accumulatedData)),
      toArray()
    );
  }

  runAllFinal(initialInput: { id: string; idVerification: string }): Observable<any> {
    const cache = new Map<string, Observable<TaskResult>>();
    const accumulatedData = new Map<string, any>();
    
    // Store initial input for final answer
    accumulatedData.set('initialInput', initialInput);

    return from(this.order).pipe(
      concatMap(name => this.runTaskInternal(name, cache, initialInput, accumulatedData)),
      toArray(),
      map(results => {
        // Create a clean final answer combining all task results
        const finalAnswer = this.createFinalAnswer(results, accumulatedData);
        
        return {
          finalAnswer,
          totalTasksExecuted: results.length,
          executionTime: results.reduce((total, result) => total + (result.durationMs || 0), 0),
          successfulTasks: results.filter(r => r.status === 'success').map(r => r.name),
          failedTasks: results.filter(r => r.status === 'error').map(r => r.name),
          skippedTasks: results.filter(r => r.status === 'skipped').map(r => r.name)
        };
      })
    );
  }

  private createFinalAnswer(results: TaskResult[], accumulatedData: Map<string, any>): any {
    const finalAnswer: any = {
      originalInput: {
        id: accumulatedData.get('initialInput')?.id || 'unknown',
        idVerification: accumulatedData.get('initialInput')?.idVerification || 'unknown'
      }
    };

    // Add results from each successful task - extract only essential data
    results.forEach(result => {
      if (result.status === 'success') {
        const taskName = result.name;
        const taskContent = result.content;
        
        switch (taskName) {
          case 'A':
            finalAnswer.compression = taskContent.compressionResult;
            break;
          case 'B':
            finalAnswer.upperCase = taskContent.upperResult;
            break;
          case 'C':
            // Extract only the essential C result data
            finalAnswer.taskCResult = {
              name: taskContent.name,
              content: taskContent.content,
              status: taskContent.status
            };
            break;
          case 'D':
            // Extract only the essential D result data
            finalAnswer.taskDResult = {
              name: taskContent.name,
              content: taskContent.content,
              status: taskContent.status
            };
            break;
          case 'E':
            // Extract only the essential E result data
            finalAnswer.taskEResult = {
              name: taskContent.name,
              content: taskContent.content,
              status: taskContent.status
            };
            break;
          default:
            finalAnswer[`task${taskName}Result`] = {
              name: taskContent.name,
              content: taskContent.content,
              status: taskContent.status
            };
        }
      }
    });

    return finalAnswer;
  }

  runTask(taskName: string, initialInput: { id: string; idVerification: string }): Observable<TaskResult> {
    const cache = new Map<string, Observable<TaskResult>>();
    const accumulatedData = new Map<string, any>();
    console.log(cache)
    return this.runTaskInternal(taskName, cache, initialInput, accumulatedData);
  }

  private runTaskInternal(
    name: string, 
    cache: Map<string, Observable<TaskResult>>, 
    initialInput?: any,
    accumulatedData: Map<string, any> = new Map()
  ): Observable<TaskResult> {
    if (cache.has(name)) {
      return cache.get(name)!;
    }

    const task = this.taskMap.get(name);
    if (!task) {
      const error = `Task not found: ${name}`;
      return throwError(() => new Error(error));
    }

    // Handle dependencies
    const deps$ = task.deps.length > 0
      ? forkJoin(
          task.deps.map(dep => this.runTaskInternal(dep, cache, initialInput, accumulatedData))
        ).pipe(
          mergeMap((results: TaskResult[]) => {
            const failedDeps = results.filter(r => r.status === 'error');
            if (failedDeps.length > 0) {
              const errorMsg = `Dependencies failed for ${name}: ${failedDeps.map(d => d.name).join(', ')}`;
              return of({
                name,
                status: 'skipped' as const,
                error: errorMsg,
              } as TaskResult);
            }
            return of(results);
          })
        )
      : of([] as TaskResult[]);

    const result$ = deps$.pipe(
      mergeMap((depResults: TaskResult[] | TaskResult) => {
        // Handle the case where deps$ returns a single TaskResult (when dependency failed)
        if (!Array.isArray(depResults)) {
          // This means a dependency failed and we got a single 'skipped' result
          return of(depResults);
        }
        
        // Skip if any dependency was skipped
        if (depResults.some(r => r.status === 'skipped')) {
          return of({
            name,
            status: 'skipped' as const,
            error: 'Skipped due to failed dependencies',
          } as TaskResult);
        }

        // Run the actual task with input from dependencies
        const startTime = Date.now();
        let taskInput;
        
        if (Array.isArray(depResults) && depResults.length > 0) {
          // For tasks with dependencies, pass all dependency results
          if (depResults.length === 1) {
            // Single dependency - pass the entire result object to preserve all data
            taskInput = depResults[0];
          } else {
            // Multiple dependencies - create an object with all dependency results
            const dependencyData = {};
            depResults.forEach(result => {
              dependencyData[result.name] = result;
            });
            taskInput = dependencyData;
          }
        } else {
          taskInput = initialInput;
        }

        // Add accumulated data to task input
        const taskInputWithAccumulatedData = {
          ...taskInput,
          accumulatedData: Object.fromEntries(accumulatedData)
        };

        return task.run(taskInputWithAccumulatedData).pipe(
          map(data => {
            const duration = Date.now() - startTime;
            
            // Store this task's result in accumulated data
            const result = {
              name: task.name,
              content: data,
              status: data?.status || 'success',
              durationMs: duration,
            } as TaskResult;
            
            // Add to accumulated data for future tasks
            accumulatedData.set(task.name, result);
            
            return result;
          }),
          catchError(err => {
            const duration = Date.now() - startTime;
            const errorMsg = err?.message ?? err?.toString() ?? 'Unknown error';
            
            return of({
              name,
              status: 'error',
              error: errorMsg,
              durationMs: duration,
            } as TaskResult);
          })
        );
      }),
      shareReplay(1)
    );

    cache.set(name, result$);
    return result$;
  }

  getTaskInfo() {
    return {
      registeredTasks: Array.from(this.taskMap.keys()),
      executionOrder: this.order,
      dependencies: Object.fromEntries(
        Array.from(this.taskMap.entries()).map(([name, task]) => [name, task.deps])
      ),
    };
  }
}