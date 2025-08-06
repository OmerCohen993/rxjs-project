import { Task } from './task.abstract';
import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export class TaskE extends Task<any> {
  readonly name = 'E';
  readonly deps: string[] = ['C'];

  run(input: { content: string; status: string; previousTaskData: any }) {
    return of('E').pipe(delay(10), map(v => ({ 
      name: v, 
      content: 'E result',
      status: 'success',
      previousTaskData: input
    })));
  }
}

export const taskE = new TaskE(); 