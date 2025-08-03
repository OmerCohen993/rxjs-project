import { Task } from './task.interface';
import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export const taskC: Task<any> = {
  name: 'C',
  deps: ['A'],
  run: () => of('C').pipe(delay(10), map(v => ({ name: v, content: 'C result' }))),
}; 