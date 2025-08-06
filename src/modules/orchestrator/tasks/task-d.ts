import { Task } from './task.abstract';
import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export class TaskD extends Task<any> {
  readonly name = 'D';
  readonly deps: string[] = ['A', 'B'];

  run() {
    return of('D').pipe(delay(50), map(v => ({ name: v, content: 'D result' })));
  }
}

export const taskD = new TaskD(); 