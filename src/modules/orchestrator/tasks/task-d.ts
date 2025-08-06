import { Task } from './task.abstract';
import { of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export class TaskD extends Task<any> {
  readonly name = 'D';
  readonly deps: string[] = ['B', 'C'];

  run(input: Array<{ content: any; status: string; previousTaskData: any }>) {
    // input is an array with data from Task-B and Task-C
    const taskBData = input[0]; // data from Task-B
    const taskCData = input[1]; // data from Task-C
    
    return of('D').pipe(delay(50), map(v => ({ 
      name: v, 
      content: 'D result',
      status: 'success',
      previousTasksData: {
        taskB: taskBData,
        taskC: taskCData
      }
    })));
  }
}

export const taskD = new TaskD(); 