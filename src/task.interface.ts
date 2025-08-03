import { Observable } from 'rxjs';

export interface Task<T = any> {
  name: string;
  deps: string[];
  run(): Observable<T>;
}