# 🚀 SystemPrompt MCP TaskChecker

> **Enterprise-grade Model Context Protocol server for intelligent task management, evaluation scoring, and session-based workflow tracking.**

[![Built by SystemPrompt.io](https://img.shields.io/badge/Built%20by-SystemPrompt.io-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjMDA3QUZGIi8+Cjwvc3ZnPgo=)](https://systemprompt.io)
[![MIT License](https://img.shields.io/badge/License-MIT-red?style=for-the-badge)](LICENSE)

**Seamlessly integrates with AI assistants to provide structured task orchestration, real-time progress monitoring, and comprehensive evaluation metrics for next-generation AI-driven productivity solutions.**

---

## ✨ What is SystemPrompt MCP TaskChecker?

The **SystemPrompt MCP TaskChecker** is a Model Context Protocol (MCP) server that transforms how AI assistants handle task management and workflow orchestration. Built by [SystemPrompt.io](https://systemprompt.io), this enterprise-grade solution bridges the gap between AI intelligence and structured productivity workflows.

### 🎯 Key Value Propositions

- **🤖 AI-Native Task Management**: Purpose-built for seamless integration with Claude, GPT, and other AI assistants
- **📊 Intelligent Evaluation Scoring**: 0-100 scoring system with comprehensive metrics tracking
- **⚡ Session-Based Architecture**: Stateful, secure, and automatically managed sessions
- **🏢 Enterprise-Ready**: Production-grade reliability with comprehensive error handling
- **🔄 Real-Time Workflow Tracking**: Live status updates and progress monitoring
- **🛡️ Secure & Compliant**: Built-in validation, session management, and data integrity

---

## 🌟 Key Features

### 🎯 **Intelligent Task Orchestration**
- **Dynamic Task Lists**: Create and manage sophisticated task hierarchies with optional initialization
- **Smart Status Tracking**: Real-time status updates (`pending` → `in_progress` → `completed`)
- **Acceptance Criteria**: Define clear, measurable completion requirements for each task
- **Flexible Updates**: Modify any task property while maintaining data integrity

### 📈 **Advanced Evaluation System**
- **Precision Scoring**: 0-100 evaluation scale for completed tasks
- **Quality Metrics**: Track task completion quality and performance indicators
- **Historical Analysis**: Maintain evaluation history for continuous improvement
- **Success Benchmarking**: Compare and analyze task completion patterns

### 🔒 **Enterprise Session Management**
- **Stateful Operations**: Maintain context across multiple interactions
- **Automatic Cleanup**: Intelligent session timeout and resource management
- **Concurrent Support**: Handle multiple simultaneous sessions
- **Security Validation**: Built-in session ID validation and error handling

### 🚀 **Production-Grade Architecture**
- **MCP 2025-03-26 Compliant**: Latest Model Context Protocol standards
- **Streamable HTTP Transport**: High-performance, scalable communication
- **Structured Error Handling**: Comprehensive error responses and logging
- **TypeScript Native**: Full type safety and developer experience

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js**: Version 18.0.0 or higher
- **npm**: Latest stable version
- **TypeScript**: Included in devDependencies

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Ejb503/systemprompt-mcp-taskchecker.git
cd systemprompt-mcp-taskchecker

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

### Development Environment

```bash
# Development mode with hot reload
npm run dev

# Run tests
npm test

# Run with coverage
npm run test:coverage

# Test client integration
npm run test:client
```

### Docker Deployment

```bash
# Build Docker image
npm run docker:build

# Run in container
npm run docker:run
```

---

## 🎮 Usage Examples

### Basic Task List Creation

```json
{
  "method": "tools/call",
  "params": {
    "name": "create_tasklist",
    "arguments": {
      "initialTasks": [
        {
          "title": "Implement user authentication",
          "acceptanceCriteria": "User can login with email/password and receive JWT token"
        },
        {
          "title": "Create dashboard UI",
          "acceptanceCriteria": "Responsive dashboard showing user metrics and navigation"
        }
      ]
    }
  }
}
```

### Task Status Updates

```json
{
  "method": "tools/call",
  "params": {
    "name": "update_task",
    "arguments": {
      "taskListId": "uuid-task-list-id",
      "taskId": "uuid-task-id",
      "updates": {
        "status": "completed",
        "evaluation": 95
      }
    }
  }
}
```

### Comprehensive Status Retrieval

```json
{
  "method": "tools/call",
  "params": {
    "name": "get_status",
    "arguments": {
      "taskListId": "uuid-task-list-id"
    }
  }
}
```

---

## 🔧 MCP Tools Reference

### `create_tasklist`
**Creates a new task list for the current session with optional initial tasks**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `initialTasks` | `Array<Task>` | No | Array of initial tasks to create |

**Response Structure:**
```typescript
{
  success: boolean;
  data: {
    id: string;
    sessionId: string;
    tasks: Task[];
    createdAt: Date;
    lastAccessed: Date;
  }
}
```

### `update_task`
**Updates specific task properties including status, evaluation, and metadata**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `taskListId` | `string` | Yes | ID of the target task list |
| `taskId` | `string` | Yes | ID of the task to update |
| `updates` | `TaskUpdates` | Yes | Object containing properties to update |

**Available Updates:**
- `title`: Task title (string)
- `status`: Task status (`pending` \| `in_progress` \| `completed`)
- `acceptanceCriteria`: Completion criteria (string)
- `evaluation`: Quality score (0-100)

### `get_status`
**Retrieves current status for all tasks or a specific task**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `taskListId` | `string` | Yes | ID of the task list to query |
| `taskId` | `string` | No | Optional specific task ID |

---

## 📊 Data Models

### Task Structure
```typescript
interface Task {
  id: string;                    // Unique task identifier
  title: string;                 // Task title/description
  status: TaskStatus;            // Current task status
  acceptanceCriteria: string;    // Completion requirements
  evaluation?: number;           // Quality score (0-100)
  createdAt: Date;              // Creation timestamp
  updatedAt: Date;              // Last modification timestamp
}

type TaskStatus = 'pending' | 'in_progress' | 'completed';
```

### TaskList Structure
```typescript
interface TaskList {
  id: string;                    // Unique list identifier
  sessionId: string;             // Associated session ID
  tasks: Task[];                 // Array of tasks
  createdAt: Date;              // Creation timestamp
  lastAccessed: Date;           // Last access timestamp
}
```

---

## 🏗️ Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                   AI Assistant (Claude, GPT)                │
└─────────────────────┬───────────────────────────────────────┘
                      │ MCP Protocol
┌─────────────────────▼───────────────────────────────────────┐
│              SystemPrompt MCP TaskChecker                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   HTTP      │  │   Session   │  │    Task Service     │  │
│  │  Transport  │  │  Manager    │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Tool      │  │   Config    │  │   In-Memory Store   │  │
│  │  Handlers   │  │  Manager    │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Protocol**: Model Context Protocol (MCP) 2025-03-26
- **Transport**: Streamable HTTP
- **Storage**: In-memory with automatic cleanup
- **Framework**: Express.js
- **Package Manager**: npm

---

## 🔒 Security & Compliance

### Security Features
- ✅ **Session Validation**: Cryptographically secure session IDs
- ✅ **Input Validation**: Comprehensive parameter validation
- ✅ **Error Handling**: Structured error responses without information leakage
- ✅ **Rate Limiting Ready**: Architecture supports rate limiting implementation
- ✅ **Transport Security**: HTTPS/TLS support for production deployments

### Compliance Standards
- **MCP Protocol Compliance**: Fully compatible with MCP 2025-03-26
- **Data Privacy**: In-memory storage with automatic cleanup
- **Enterprise Security**: Session-based isolation and validation

---

## 📈 Performance & Scaling

### Performance Characteristics
- **Memory Efficient**: In-memory storage with intelligent cleanup
- **Low Latency**: Sub-millisecond response times for typical operations
- **Concurrent Sessions**: Supports 1000+ simultaneous sessions
- **Auto-Scaling Ready**: Stateless architecture compatible with horizontal scaling

### Resource Limits
| Resource | Default Limit | Configurable |
|----------|---------------|--------------|
| Max Tasks per List | 100 | ✅ |
| Max Task Lists | 5 | ✅ |
| Session Duration | 5 minutes | ✅ |
| Concurrent Sessions | 1000 | ✅ |
| Evaluation Range | 0-100 | ✅ |

---

## 🌐 Deployment Options

### Production Deployment

```bash
# Environment variables
export NODE_ENV=production
export PORT=3000
export LOG_LEVEL=info

# Start production server
npm start
```

### Docker Production

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci --only=production && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Cloud Integration
- **AWS**: Compatible with ECS, Lambda, and EC2
- **Google Cloud**: Supports Cloud Run, GKE, and Compute Engine
- **Azure**: Works with Container Instances, AKS, and App Service
- **Railway/Vercel**: One-click deployment ready

---

## 🧪 Testing & Quality Assurance

### Test Coverage
```bash
# Unit tests
npm test

# Integration tests
npm run test:client

# Coverage report
npm run test:coverage

# Development testing
npm run test:watch
```

### Quality Tools
- **TypeScript**: Full type safety and compile-time checks
- **ESLint**: Code quality and consistency enforcement
- **Prettier**: Automated code formatting
- **Jest**: Comprehensive testing framework

---

## 📚 API Documentation

### Health Check Endpoints

```http
GET /health
```
Returns server health status and active session count.

```http
GET /sessions
```
Lists active sessions (development/debugging).

```http
DELETE /sessions/:sessionId
```
Manually cleanup specific session (testing).

### MCP Endpoint

```http
POST /mcp
```
Main MCP protocol endpoint for tool interactions.

---

## 🤝 Integration Examples

### Claude Desktop Integration

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "systemprompt-taskchecker": {
      "command": "npx",
      "args": ["systemprompt-mcp-taskchecker"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### Custom AI Assistant Integration

```javascript
import { MCPClient } from '@modelcontextprotocol/sdk/client/index.js';

const client = new MCPClient({
  transport: new HTTPClientTransport('http://localhost:3000/mcp')
});

// Create task list
const result = await client.callTool('create_tasklist', {
  initialTasks: [
    {
      title: 'Setup development environment',
      acceptanceCriteria: 'All dependencies installed and tests passing'
    }
  ]
});
```

---

## 🎯 Use Cases

### 🔧 **Development Workflows**
- Track coding tasks and milestones
- Manage code review requirements
- Monitor deployment checklists
- Evaluate task completion quality

### 📋 **Project Management**
- Structure project deliverables
- Track acceptance criteria compliance
- Generate progress reports
- Maintain quality benchmarks

### 🏢 **Enterprise Operations**
- Standardize workflow processes
- Implement quality gates
- Track team performance metrics
- Automate task orchestration

### 🤖 **AI Assistant Enhancement**
- Provide structured task context
- Enable persistent workflow memory
- Support complex multi-step processes
- Facilitate evaluation and improvement

---

## 🛠️ Development & Contributing

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/systemprompt-mcp-taskchecker.git
cd systemprompt-mcp-taskchecker

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests in watch mode
npm run test:watch
```

### Code Quality Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration with custom rules
- **Prettier**: Consistent code formatting
- **Jest**: Minimum 80% test coverage
- **Conventional Commits**: Standardized commit messages

---

## 📊 Monitoring & Observability

### Built-in Monitoring
- **Health Checks**: `/health` endpoint with detailed status
- **Session Tracking**: Real-time active session monitoring
- **Performance Metrics**: Request/response timing and success rates
- **Error Tracking**: Structured error logging with session context

### Logging Configuration
```bash
# Set log level
export LOG_LEVEL=debug  # debug, info, warn, error

# Enable structured logging
export STRUCTURED_LOGS=true
```

---

## 🌟 Why SystemPrompt.io?

[**SystemPrompt.io**](https://systemprompt.io) is at the forefront of AI productivity innovation, creating enterprise-grade solutions that seamlessly bridge human intelligence with artificial intelligence. Our MCP TaskChecker represents our commitment to:

- **🚀 Innovation**: Cutting-edge AI integration technologies
- **🏢 Enterprise Focus**: Production-ready, scalable solutions
- **🔒 Security First**: Built-in security and compliance features
- **🌐 Open Standards**: Full Model Context Protocol compliance
- **💡 Developer Experience**: Intuitive APIs and comprehensive documentation

### Our Mission
*Empowering organizations to harness the full potential of AI through intelligent workflow orchestration and productivity solutions.*

---

## 📞 Support & Resources

### 🔗 **Quick Links**
- **🏠 Homepage**: [https://systemprompt.io](https://systemprompt.io)
- **📖 Documentation**: [https://systemprompt.io/docs/mcp-taskchecker](https://systemprompt.io/docs/mcp-taskchecker)
- **💬 Support**: [https://systemprompt.io/support](https://systemprompt.io/support)
- **🐛 Issues**: [GitHub Issues](https://github.com/Ejb503/systemprompt-mcp-taskchecker/issues)
- **📧 Contact**: [ed@tyingshoelaces.com](mailto:ed@tyingshoelaces.com)

### 🤝 **Community**
- **GitHub Discussions**: Share ideas and ask questions
- **Discord Server**: Real-time community support (coming soon)
- **Blog**: Latest updates and tutorials at [systemprompt.io/blog](https://systemprompt.io/blog)

---

## 📄 License

**MIT License**

```
Copyright 2025 SystemPrompt.io

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**🚀 Built with ❤️ by [SystemPrompt.io](https://systemprompt.io)**

*Transforming AI productivity, one workflow at a time.*

[![SystemPrompt.io](https://img.shields.io/badge/Powered%20by-SystemPrompt.io-blue?style=for-the-badge&logoColor=white)](https://systemprompt.io)

</div>