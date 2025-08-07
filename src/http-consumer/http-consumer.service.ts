import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpConsumerService {
  async post<T>(url: string, data: any): Promise<T> {
    // Simulate HTTP POST request
    console.log(`POST ${url} with data:`, data);
    
    // Simulate response
    return {
      score: 0.95,
      template: 'template_data',
      isVerified: true
    } as T;
  }

  async get<T>(url: string): Promise<T> {
    // Simulate HTTP GET request
    console.log(`GET ${url}`);
    
    return {} as T;
  }
}

