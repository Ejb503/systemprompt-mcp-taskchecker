import { CallToolRequest, ServerRequest, ServerNotification } from "@modelcontextprotocol/sdk/types.js";
import { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { TaskService } from "../services/task-service.js";
import { CreateTaskListRequest, UpdateTaskRequest, GetStatusRequest, TaskResponse } from "../types/task.js";

const taskService = TaskService.getInstance();

// Tool definitions
export const tools = [
  {
    name: "create_tasklist",
    description: "Create a new task list for the current session. Can optionally include initial tasks.",
    inputSchema: {
      type: "object",
      properties: {
        initialTasks: {
          type: "array",
          description: "Optional array of initial tasks to create",
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "Task title"
              },
              acceptanceCriteria: {
                type: "string",
                description: "Criteria that must be met for the task to be considered complete"
              }
            },
            required: ["title", "acceptanceCriteria"]
          }
        }
      },
      additionalProperties: false
    }
  },
  {
    name: "update_task",
    description: "Update a specific task's properties including title, status, acceptance criteria, or evaluation score.",
    inputSchema: {
      type: "object",
      properties: {
        taskListId: {
          type: "string",
          description: "ID of the task list containing the task"
        },
        taskId: {
          type: "string",
          description: "ID of the task to update"
        },
        updates: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "New task title"
            },
            status: {
              type: "string",
              enum: ["pending", "in_progress", "completed"],
              description: "New task status"
            },
            acceptanceCriteria: {
              type: "string",
              description: "New acceptance criteria"
            },
            evaluation: {
              type: "number",
              minimum: 0,
              maximum: 100,
              description: "Evaluation score from 0-100"
            }
          }
        }
      },
      required: ["taskListId", "taskId", "updates"]
    }
  },
  {
    name: "get_status",
    description: "Get the current status of all tasks in a task list, or a specific task by ID.",
    inputSchema: {
      type: "object",
      properties: {
        taskListId: {
          type: "string",
          description: "ID of the task list to query"
        },
        taskId: {
          type: "string",
          description: "Optional: ID of specific task to query. If omitted, returns all tasks."
        }
      },
      required: ["taskListId"]
    }
  }
];

export async function handleListTools() {
  return { tools };
}

export async function handleToolCall(
  request: CallToolRequest, 
  extra: RequestHandlerExtra<ServerRequest, ServerNotification>
) {
  const { name, arguments: args } = request.params;
  const { sessionId } = extra;

  // Session validation
  if (!sessionId) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: false,
            error: "Session ID not available from transport context"
          } as TaskResponse, null, 2)
        }
      ]
    };
  }

  console.log(`🔧 Tool call: ${name} for session: ${sessionId}`);

  try {
    switch (name) {
      case "create_tasklist":
        return await handleCreateTaskList(args as CreateTaskListRequest, sessionId);
      
      case "update_task":
        return await handleUpdateTask((args || {}) as unknown as UpdateTaskRequest);
      
      case "get_status":
        return await handleGetStatus((args || {}) as unknown as GetStatusRequest);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`❌ Tool call error for session ${sessionId}:`, errorMessage);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: false,
            error: errorMessage
          } as TaskResponse, null, 2)
        }
      ]
    };
  }
}

async function handleCreateTaskList(args: CreateTaskListRequest, sessionId: string) {
  const taskList = taskService.createTaskList(sessionId, args.initialTasks);
  
  const response: TaskResponse = {
    success: true,
    data: taskList
  };

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(response, null, 2)
      }
    ]
  };
}

async function handleUpdateTask(request: UpdateTaskRequest) {
  const updatedTask = taskService.updateTask(
    request.taskListId,
    request.taskId,
    request.updates
  );

  if (!updatedTask) {
    const response: TaskResponse = {
      success: false,
      error: "Task or task list not found"
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response, null, 2)
        }
      ]
    };
  }

  const response: TaskResponse = {
    success: true,
    data: updatedTask
  };

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(response, null, 2)
      }
    ]
  };
}

async function handleGetStatus(request: GetStatusRequest) {
  let data;
  
  if (request.taskId) {
    // Get specific task
    data = taskService.getTask(request.taskListId, request.taskId);
    if (!data) {
      const response: TaskResponse = {
        success: false,
        error: "Task not found"
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2)
          }
        ]
      };
    }
  } else {
    // Get all tasks
    data = taskService.getAllTasks(request.taskListId);
    if (!data) {
      const response: TaskResponse = {
        success: false,
        error: "Task list not found"
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response, null, 2)
          }
        ]
      };
    }
  }

  const response: TaskResponse = {
    success: true,
    data
  };

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(response, null, 2)
      }
    ]
  };
}