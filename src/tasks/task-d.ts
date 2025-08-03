import { Task } from './task.interface';
import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export const taskD: Task<any> = {
  name: 'D',
  deps: ['A', 'B'],
  run: () => of('D').pipe(delay(50), map(v => ({ name: v, content: 'D result' }))),
}; 