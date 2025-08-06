export { Task } from './task.abstract';
export { TaskResult } from './types/task-result.interface';
export { createTaskA } from './task-a';
export { createTaskB } from './task-b';
export { taskC } from './task-c';
export { taskD } from './task-d';
export { taskE } from './task-e';

import { taskC } from './task-c';
import { taskD } from './task-d';
import { taskE } from './task-e';

// Note: taskA and taskB are now created with dependency injection in the orchestrator service
export const tasks = [taskC, taskD, taskE];