//fixed-cant be changed x
import { Injectable } from '@nestjs/common';
import { FacialAuthParameters } from './models/facial-auth.model';
import { FacialAuthResult } from './types/facial-auth-result.type';
import { FacialRecoService } from 'src/shared/http-consumer/facial-recon-http.module';

@Injectable()
export class FacialAuthService {
  constructor(private readonly facialRecoService: FacialRecoService) {}

  public compareStrings(facialAuthData: FacialAuthParameters): Promise<FacialAuthResult> {
    return this.facialRecoService.post('/facial/authenticate', facialAuthData);
  }
}

