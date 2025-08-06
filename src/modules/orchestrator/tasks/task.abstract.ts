import { Observable } from 'rxjs';

export abstract class Task<T = any> {
  abstract readonly name: string;
  abstract readonly deps: string[];
  abstract run(input?: any): Observable<T>;
} 