import { Task } from './task.abstract';
import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export class TaskC extends Task<any> {
  readonly name = 'C';
  readonly deps: string[] = ['A'];

  run() {
    return of('C').pipe(delay(10), map(v => ({ name: v, content: 'C result' })));
  }
}

export const taskC = new TaskC(); 