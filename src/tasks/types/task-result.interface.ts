export interface TaskResult {
  name: string;
  status: 'success' | 'error' | 'skipped';
  content?: any;
  error?: string;
  durationMs?: number;
} 