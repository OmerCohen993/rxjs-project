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

@Injectable()
export class OrchestratorService implements OnModuleInit {
  private order: string[] = [];
  private taskMap = new Map<string, Task>();

  onModuleInit() {
    for (const task of tasks) {
      this.taskMap.set(task.name, task);
    }

    const edges: [string, string][] = [];
    for (const task of tasks) {
      for (const dep of task.deps) {
        edges.push([dep, task.name]);
      }
    }

    this.order = toposort(edges);
    console.log('Execution order:', this.order);
  }

  runAll(): Observable<any[]> {
    const cache = new Map<string, Observable<any>>();

    return from(this.order).pipe(
      concatMap(name => this.runTask(name, cache)),
      toArray()
    );
  }

  private runTask(name: string, cache: Map<string, Observable<any>>): Observable<any> {
    if (cache.has(name)) {
      return cache.get(name)!;
    }

    const task = this.taskMap.get(name);
    if (!task) throw new Error(`Task not found: ${name}`);

    const deps$ = task.deps.length
      ? forkJoin(task.deps.map(dep => this.runTask(dep, cache))).pipe(
          mergeMap((results: any[]) => {
            const failedDep = results.find(r => r?.status === 'error');
            if (failedDep) {
              return throwError(() =>
                new Error(`Dependency failed for ${name}: ${failedDep.name}`)
              );
            }
            return of(null);
          }),
          catchError(err => {
            console.error(`Dependency failed for ${name}:`, err);
            return throwError(() => err);
          })
        )
      : of(null);

    const result$ = deps$.pipe(
      mergeMap(() => {
        const start = Date.now();
        return task.run().pipe(
          map(data => ({
            name: task.name,
            content: data?.content ?? data,
            status: 'success',
            durationMs: Date.now() - start,
          }))
        );
      }),
      catchError(err => {
        console.error(`Task failed: ${name}`, err);
        return of({
          name,
          status: 'error',
          error: err?.message ?? err,
        });
      }),
      shareReplay(1)
    );

    cache.set(name, result$);
    return result$;
  }
} 