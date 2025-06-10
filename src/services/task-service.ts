import { randomUUID } from 'node:crypto';
import { Task, TaskList, TaskStatus } from '../types/task.js';

export class TaskService {
  private static instance: TaskService;
  private taskLists: Map<string, TaskList> = new Map();
  private cleanupInterval: NodeJS.Timeout;
  private readonly CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
  private readonly MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

  private constructor() {
    // Start cleanup interval
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldTaskLists();
    }, this.CLEANUP_INTERVAL);
  }

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  public createTaskList(sessionId: string, initialTasks?: Array<{ title: string; acceptanceCriteria: string }>): TaskList {
    const taskListId = randomUUID();
    const now = new Date();
    
    const tasks: Task[] = initialTasks?.map(task => ({
      id: randomUUID(),
      title: task.title,
      status: 'pending' as TaskStatus,
      acceptanceCriteria: task.acceptanceCriteria,
      createdAt: now,
      updatedAt: now,
    })) || [];

    const taskList: TaskList = {
      id: taskListId,
      sessionId,
      tasks,
      createdAt: now,
      lastAccessed: now,
    };

    this.taskLists.set(taskListId, taskList);
    return taskList;
  }

  public getTaskList(taskListId: string): TaskList | null {
    const taskList = this.taskLists.get(taskListId);
    if (taskList) {
      // Update last accessed time
      taskList.lastAccessed = new Date();
      this.taskLists.set(taskListId, taskList);
    }
    return taskList || null;
  }

  public updateTask(taskListId: string, taskId: string, updates: {
    title?: string;
    status?: TaskStatus;
    acceptanceCriteria?: string;
    evaluation?: number;
  }): Task | null {
    const taskList = this.getTaskList(taskListId);
    if (!taskList) return null;

    const taskIndex = taskList.tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return null;

    const task = taskList.tasks[taskIndex];
    
    // Validate evaluation score
    if (updates.evaluation !== undefined && (updates.evaluation < 0 || updates.evaluation > 100)) {
      throw new Error('Evaluation must be between 0 and 100');
    }

    // Update task properties
    const updatedTask: Task = {
      ...task,
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.status !== undefined && { status: updates.status }),
      ...(updates.acceptanceCriteria !== undefined && { acceptanceCriteria: updates.acceptanceCriteria }),
      ...(updates.evaluation !== undefined && { evaluation: updates.evaluation }),
      updatedAt: new Date(),
    };

    taskList.tasks[taskIndex] = updatedTask;
    taskList.lastAccessed = new Date();
    this.taskLists.set(taskListId, taskList);

    return updatedTask;
  }

  public getTask(taskListId: string, taskId: string): Task | null {
    const taskList = this.getTaskList(taskListId);
    if (!taskList) return null;

    return taskList.tasks.find(task => task.id === taskId) || null;
  }

  public getAllTasks(taskListId: string): Task[] | null {
    const taskList = this.getTaskList(taskListId);
    return taskList ? taskList.tasks : null;
  }

  public deleteTaskList(taskListId: string): boolean {
    return this.taskLists.delete(taskListId);
  }

  public deleteTaskListBySession(sessionId: string): number {
    let deletedCount = 0;
    for (const [id, taskList] of this.taskLists.entries()) {
      if (taskList.sessionId === sessionId) {
        this.taskLists.delete(id);
        deletedCount++;
      }
    }
    return deletedCount;
  }

  private cleanupOldTaskLists(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [id, taskList] of this.taskLists.entries()) {
      if (now - taskList.lastAccessed.getTime() > this.MAX_AGE) {
        this.taskLists.delete(id);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} old task lists`);
    }
  }

  public getStats(): { totalTaskLists: number; totalTasks: number } {
    let totalTasks = 0;
    for (const taskList of this.taskLists.values()) {
      totalTasks += taskList.tasks.length;
    }
    return {
      totalTaskLists: this.taskLists.size,
      totalTasks,
    };
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.taskLists.clear();
  }
}