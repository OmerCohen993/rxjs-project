import { Task } from './task.interface';
import { of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export const taskB: Task<any> = {
  name: 'B',
  deps: ['A'],
  run: () => {
    const fail = Math.random() < 0.5;
    return fail
      ? throwError(() => new Error('Simulated failure in task B'))
      : of('B').pipe(delay(20), map(v => ({ name: v, content: 'B result' })));
  },
}; 