import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StringCompressionService {
  private readonly logger = new Logger(StringCompressionService.name);

  async compressStrings(id: string, idVerification: string): Promise<any> {
    this.logger.log(`Processing compression for id: ${id}, idVerification: ${idVerification}`);
    
    try {
      // Simulate some compression logic
      const compressedId = this.compressString(id);
      const compressedVerification = this.compressString(idVerification);
      
      const result = {
        originalId: id,
        originalIdVerification: idVerification,
        compressedId,
        compressedVerification,
        compressionRatio: {
          id: ((id.length - compressedId.length) / id.length * 100).toFixed(2) + '%',
          verification: ((idVerification.length - compressedVerification.length) / idVerification.length * 100).toFixed(2) + '%'
        }
      };
      
      this.logger.log(`Compression successful for id: ${id} - Status: SUCCESS`);
      return result;
      
    } catch (error) {
      this.logger.error(`Compression failed for id: ${id} - Status: FAILURE`, error.stack);
      throw new Error(`Compression failed: ${error.message}`);
    }
  }

  private compressString(input: string): string {
    if (!input || input.length === 0) {
      return input;
    }

    let compressed = '';
    let count = 1;
    let currentChar = input[0];

    for (let i = 1; i < input.length; i++) {
      if (input[i] === currentChar) {
        count++;
      } else {
        compressed += count > 1 ? `${count}${currentChar}` : currentChar;
        currentChar = input[i];
        count = 1;
      }
    }

    // Handle the last character
    compressed += count > 1 ? `${count}${currentChar}` : currentChar;

    return compressed;
  }
} 