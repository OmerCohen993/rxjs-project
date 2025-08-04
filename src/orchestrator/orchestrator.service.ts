// src/orchestrator/orchestrator.service.ts
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

@Injectable()
export class OrchestratorService implements OnModuleInit {
  private order: string[] = [];
  private taskMap = new Map<string, Task>();

  onModuleInit() {
    this.order = initializeTasks(tasks, this.taskMap);
  }

  runAll(): Observable<TaskResult[]> {
    const cache = new Map<string, Observable<TaskResult>>();

    return from(this.order).pipe(
      concatMap(name => this.runTaskInternal(name, cache)),
      toArray()
    );
  }

  runTask(taskName: string): Observable<TaskResult> {
    const cache = new Map<string, Observable<TaskResult>>();
    console.log(cache)
    return this.runTaskInternal(taskName, cache);
  }

  private runTaskInternal(name: string, cache: Map<string, Observable<TaskResult>>): Observable<TaskResult> {
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
          task.deps.map(dep => this.runTaskInternal(dep, cache))
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

        // Run the actual task
        const startTime = Date.now();

        return task.run().pipe(
          map(data => {
            const duration = Date.now() - startTime;
            
            return {
              name: task.name,
              content: data?.content ?? data,
              status: 'success' as const,
              durationMs: duration,
            } as TaskResult;
          }),
          catchError(err => {
            const duration = Date.now() - startTime;
            const errorMsg = err?.message ?? err?.toString() ?? 'Unknown error';
            
            return of({
              name,
              status: 'error' as const,
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