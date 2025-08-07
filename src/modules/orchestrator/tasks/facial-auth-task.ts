import { Task } from './task.abstract';
import { from, Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { FacialAuthService } from '../../facial-auth/facial-auth.service';
import { FacialAuthParameters } from '../../facial-auth/models/facial-auth.model';
import { FacialAuthResult } from '../../facial-auth/types/facial-auth-result.type';

export class FacialAuthTask extends Task<any> {
  readonly name = 'FacialAuth';
  readonly deps: string[] = [];

  constructor(private readonly facialAuthService: FacialAuthService) {
    super();
  }

  run(input?: any): Observable<any> {
    // Convert input to FacialAuthParameters format
    const facialAuthData: FacialAuthParameters = {
      stringA: input.stringA || '',
      stringB: input.stringB || ''
    };

    return from(this.facialAuthService.compareStrings(facialAuthData)).pipe(
      delay(100),
      map((facialAuth: FacialAuthResult) => ({
        name: 'FacialAuth',
        content: 'Facial authentication completed',
        facialAuthResult: {
          score: facialAuth.score,
          template: facialAuth.template,
          isVerified: facialAuth.isVerified
        },
        status: facialAuth.isVerified ? 'success' : 'failed'
      }))
    );
  }
}

// Factory function for dependency injection
export const createFacialAuthTask = (facialAuthService: FacialAuthService) => 
  new FacialAuthTask(facialAuthService);
