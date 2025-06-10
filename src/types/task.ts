export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  acceptanceCriteria: string;
  evaluation?: number; // 0-100, optional until task completed
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskList {
  id: string;
  sessionId: string;
  tasks: Task[];
  createdAt: Date;
  lastAccessed: Date;
}

export interface CreateTaskListRequest {
  initialTasks?: Array<{
    title: string;
    acceptanceCriteria: string;
  }>;
}

export interface UpdateTaskRequest {
  taskListId: string;
  taskId: string;
  updates: {
    title?: string;
    status?: TaskStatus;
    acceptanceCriteria?: string;
    evaluation?: number;
  };
}

export interface GetStatusRequest {
  taskListId: string;
  taskId?: string; // Optional - if not provided, returns all tasks
}

export interface TaskResponse {
  success: boolean;
  data?: TaskList | Task | Task[];
  error?: string;
}