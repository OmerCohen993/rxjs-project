import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { ControllersModule } from './controllers/controllers.module';

@Module({
  imports: [TasksModule, ControllersModule],
})
export class AppModule {}