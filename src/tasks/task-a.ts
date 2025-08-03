import { Task } from './task.interface';
import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export const taskA: Task<any> = {
  name: 'A',
  deps: [],
  run: () => of('A').pipe(delay(0), map(v => ({ name: v, content: 'A result' }))),
}; 