import { Task } from './task.abstract';
import { of, from } from 'rxjs';
import { delay, map, mergeMap } from 'rxjs/operators';
import { StringCompressionService } from '../../string-compression/service/string-compression.service';

export class TaskA extends Task<any> {
  readonly name = 'A';
  readonly deps: string[] = [];

  constructor(private readonly stringCompressionService: StringCompressionService) {
    super();
  }

  run(input: { id: string; idVerification: string }) {
    return from(this.stringCompressionService.compressStrings(input.id, input.idVerification)).pipe(
      delay(0),
      map(compressionResult => ({ 
        name: 'A', 
        content: 'A result',
        compressionResult,
        status: 'success'
      }))
    );
  }
}

// We'll need to create the instance with dependency injection
export const createTaskA = (stringCompressionService: StringCompressionService) => new TaskA(stringCompressionService); 