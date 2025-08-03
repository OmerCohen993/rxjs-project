import { Task } from './task.interface';
import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export const taskE: Task<any> = {
  name: 'E',
  deps: ['C'],
  run: () => of('E').pipe(delay(10), map(v => ({ name: v, content: 'E result' }))),
}; 