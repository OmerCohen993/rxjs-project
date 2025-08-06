import { Task } from './task.abstract';
import { of, from, throwError } from 'rxjs';
import { delay, map, mergeMap } from 'rxjs/operators';
import { StringUpperClassService } from '../../string-upper-class/service/string-upper-class.service';

export class TaskB extends Task<any> {
  readonly name = 'B';
  readonly deps: string[] = ['A'];

  constructor(private readonly stringUpperClassService: StringUpperClassService) {
    super();
  }

  run(input: any) {
    // Extract compression result from task A's content
    const taskAContent = input.content;
    const { originalId, originalIdVerification } = taskAContent.compressionResult;
    
    return from(this.stringUpperClassService.toUpperClass(originalId, originalIdVerification)).pipe(
      delay(20),
      map(upperResult => ({
        name: 'B',
        content: 'B result',
        status: 'success',
        upperResult,
        previousTaskData: input
      }))
    );
  }
}

export const createTaskB = (stringUpperClassService: StringUpperClassService) => new TaskB(stringUpperClassService); 