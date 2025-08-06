import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StringUpperClassService {
  private readonly logger = new Logger(StringUpperClassService.name);

  async toUpperClass(str1: string, str2: string): Promise<any> {
    this.logger.log(`Converting to upper class: str1=${str1}, str2=${str2}`);
    try {
      const upperStr1 = str1.toUpperCase();
      const upperStr2 = str2.toUpperCase();
      return {
        originalStr1: str1,
        originalStr2: str2,
        upperStr1,
        upperStr2
      };
    } catch (error) {
      this.logger.error(`Upper class conversion failed`, error.stack);
      throw new Error(`Upper class conversion failed: ${error.message}`);
    }
  }
} 