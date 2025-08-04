import { Task } from './task.abstract';
import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export class TaskA extends Task<any> {
  readonly name = 'A';
  readonly deps: string[] = [];

  run() {
    return of('A').pipe(delay(0), map(v => ({ name: v, content: 'A result' })));
  }
}

export const taskA = new TaskA(); 