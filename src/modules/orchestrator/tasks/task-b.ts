import { Task } from './task.abstract';
import { of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export class TaskB extends Task<any> {
  readonly name = 'B';
  readonly deps: string[] = ['A'];

  run() {
    const fail = Math.random() < 0.5;
    return fail
      ? throwError(() => new Error('Simulated failure in task B'))
      : of('B').pipe(delay(20), map(v => ({ name: v, content: 'B result' })));
  }
}

export const taskB = new TaskB(); 