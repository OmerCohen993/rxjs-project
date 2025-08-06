import { Controller, Post, Body, Logger } from '@nestjs/common';
import { StringUpperClassService } from '../service/string-upper-class.service';

interface UpperClassRequestDto {
  str1: string;
  str2: string;
}

@Controller('string-upper-class')
export class StringUpperClassController {
  private readonly logger = new Logger(StringUpperClassController.name);

  constructor(private readonly stringUpperClassService: StringUpperClassService) {}

  @Post('upper')
  async toUpperClass(@Body() request: UpperClassRequestDto) {
    this.logger.log(`Received upper class request for str1: ${request.str1}, str2: ${request.str2}`);
    try {
      const result = await this.stringUpperClassService.toUpperClass(request.str1, request.str2);
      this.logger.log(`Upper class conversion successful for str1: ${request.str1}`);
      return {
        status: 'success',
        message: 'Strings converted to upper class successfully',
        data: result
      };
    } catch (error) {
      this.logger.error(`Upper class conversion failed for str1: ${request.str1}`, error.stack);
      return {
        status: 'failure',
        message: 'Upper class conversion failed',
        error: error.message
      };
    }
  }
} 