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
import { createTaskA } from '../tasks/task-a';
import { taskB, taskC, taskD, taskE } from '../tasks/index';

@Injectable()
export class OrchestratorService implements OnModuleInit {
  private order: string[] = [];
  private taskMap = new Map<string, Task>();

  constructor(private readonly stringCompressionService: StringCompressionService) {}

  onModuleInit() {
    // Create task instances with dependency injection
    const taskA = createTaskA(this.stringCompressionService);
    const allTasks = [taskA, taskB, taskC, taskD, taskE];
    
    this.order = initializeTasks(allTasks, this.taskMap);
  }

  runAll(initialInput: { id: string; idVerification: string }): Observable<TaskResult[]> {
    const cache = new Map<string, Observable<TaskResult>>();

    return from(this.order).pipe(
      concatMap(name => this.runTaskInternal(name, cache, initialInput)),
      toArray()
    );
  }

  runTask(taskName: string, initialInput: { id: string; idVerification: string }): Observable<TaskResult> {
    const cache = new Map<string, Observable<TaskResult>>();
    console.log(cache)
    return this.runTaskInternal(taskName, cache, initialInput);
  }

  private runTaskInternal(
    name: string, 
    cache: Map<string, Observable<TaskResult>>, 
    initialInput?: any
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
          task.deps.map(dep => this.runTaskInternal(dep, cache, initialInput))
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
        const taskInput = Array.isArray(depResults) && depResults.length > 0 
          ? depResults  // Pass all dependency results
          : initialInput;

        return task.run(taskInput).pipe(
          map(data => {
            const duration = Date.now() - startTime;
            
            return {
              name: task.name,
              content: data,
              status: data?.status || 'success',
              durationMs: duration,
            } as TaskResult;
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