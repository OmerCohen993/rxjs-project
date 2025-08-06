// src/app.module.ts
import { Module } from '@nestjs/common';
import { OrchestratorModule } from './modules/orchestrator/orchestrator.module';
import { StringCompressionModule } from './modules/string-compression/string-compression.module';

@Module({
  imports: [OrchestratorModule, StringCompressionModule],
})
export class AppModule {}