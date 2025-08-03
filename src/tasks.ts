import { Task } from './task.interface';
import { of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export const tasks: Task<any>[] = [
  {
    name: 'A',
    deps: [],
    run: () => of('A').pipe(delay(0), map(v => ({ name: v, content: 'A result' }))),
  },
  {
  name: 'B',
  deps: ['A'],
  run: () => {
    const fail = Math.random() < 0.5;
    return fail
      ? throwError(() => new Error('Simulated failure in task B'))
      : of('B').pipe(delay(20), map(v => ({ name: v, content: 'B result' })));
  },
},
  {
    name: 'C',
    deps: ['A'],
    run: () => of('C').pipe(delay(10), map(v => ({ name: v, content: 'C result' }))),
  },
  {
    name: 'D',
    deps: ['A', 'B'],
    run: () => of('D').pipe(delay(50), map(v => ({ name: v, content: 'D result' }))),
  },
  {
    name: 'E',
    deps: ['C'],
    run: () => of('E').pipe(delay(10), map(v => ({ name: v, content: 'E result' }))),
  },
];