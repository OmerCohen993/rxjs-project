// src/app.module.ts
import { Module } from '@nestjs/common';
import { OrchestratorModule } from './modules/orchestrator/orchestrator.module';
import { StringCompressionModule } from './modules/string-compression/string-compression.module';
import { StringUpperClassModule } from './modules/string-upper-class/string-upper-class.module';

@Module({
  imports: [OrchestratorModule, StringCompressionModule, StringUpperClassModule],
})
export class AppModule {}