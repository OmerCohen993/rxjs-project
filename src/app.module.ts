// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { ControllersModule } from './controllers/controllers.module';

@Module({
  imports: [TasksModule, ControllersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}