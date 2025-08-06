import { Controller, Post, Body, Logger } from '@nestjs/common';
import { StringCompressionService } from '../service/string-compression.service';

interface CompressionRequestDto {
  id: string;
  idVerification: string;
}

@Controller('string-compression')
export class StringCompressionController {
  private readonly logger = new Logger(StringCompressionController.name);

  constructor(private readonly stringCompressionService: StringCompressionService) {}

  @Post('compress')
  async compressStrings(@Body() request: CompressionRequestDto) {
    this.logger.log(`Received compression request for id: ${request.id}`);
    
    try {
      const result = await this.stringCompressionService.compressStrings(
        request.id,
        request.idVerification
      );
      
      this.logger.log(`Compression successful for id: ${request.id}`);
      return {
        status: 'success',
        message: 'Strings compressed successfully',
        data: result
      };
    } catch (error) {
      this.logger.error(`Compression failed for id: ${request.id}`, error.stack);
      return {
        status: 'failure',
        message: 'String compression failed',
        error: error.message
      };
    }
  }
} 