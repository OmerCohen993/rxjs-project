import { Module } from '@nestjs/common';
import { TaskA } from './task-a';
import { TaskB } from './task-b';
import { TaskC } from './task-c';
import { TaskD } from './task-d';
import { TaskE } from './task-e';

@Module({
  providers: [TaskA, TaskB, TaskC, TaskD, TaskE],
  exports: [TaskA, TaskB, TaskC, TaskD, TaskE],
})
export class TasksModule {} 