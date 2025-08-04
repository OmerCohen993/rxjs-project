import * as toposort from 'toposort';
import { Task } from '../../tasks/index';

export function initializeTasks(tasks: Task<any>[], taskMap: Map<string, Task>): string[] {
  // Clear existing data
  taskMap.clear();

  // Register all tasks
  for (const task of tasks) {
    taskMap.set(task.name, task);
  }

  // Build dependency graph
  const edges: [string, string][] = [];
  const allNodes = new Set<string>();

  for (const task of tasks) {
    allNodes.add(task.name);
    for (const dep of task.deps) {
      if (!taskMap.has(dep)) {
        throw new Error(`Task ${task.name} depends on unknown task: ${dep}`);
      }
      edges.push([dep, task.name]);
      allNodes.add(dep);
    }
  }

  let order: string[] = [];
  try {
    // Get topological order
    order = toposort(edges);
    // Add nodes with no dependencies that might not be in edges
    for (const node of allNodes) {
      if (!order.includes(node)) {
        order.unshift(node);
      }
    }
  } catch (error: any) {
    throw new Error(`Circular dependency detected in tasks: ${error.message}`);
  }
  return order;
} 