# SystemPrompt MCP TaskChecker

A specialized Model Context Protocol (MCP) server for task management with in-memory session-based storage.

## Features

- **Create Task Lists**: Session-based task list creation with optional initial tasks
- **Update Tasks**: Modify task properties including title, status, acceptance criteria, and evaluation scores
- **Get Status**: Retrieve task status in JSON format for specific tasks or entire lists
- **Session Management**: Automatic cleanup of old task lists
- **Evaluation Scoring**: 0-100 scoring system for completed tasks

## Installation

```bash
npm install
npm run build
```

## Usage

### As MCP Server

```bash
npm start
```

### Development

```bash
npm run dev
```

## Tools

### create_tasklist

Creates a new task list for the current session.

**Parameters:**
- `sessionId` (string): Unique session identifier
- `initialTasks` (array, optional): Array of initial tasks with title and acceptanceCriteria

### update_task

Updates a specific task's properties.

**Parameters:**
- `taskListId` (string): ID of the task list
- `taskId` (string): ID of the task to update
- `updates` (object): Properties to update (title, status, acceptanceCriteria, evaluation)

### get_status

Gets the current status of tasks.

**Parameters:**
- `taskListId` (string): ID of the task list
- `taskId` (string, optional): Specific task ID (if omitted, returns all tasks)

## Task Model

```typescript
interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  acceptanceCriteria: string;
  evaluation?: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}
```

## License

Apache-2.0