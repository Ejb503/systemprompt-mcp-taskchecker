#!/usr/bin/env node
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { randomUUID } from "node:crypto";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

import { serverConfig, serverCapabilities } from "./config/server-config.js";
import { handleListTools, handleToolCall } from "./handlers/tool-handlers.js";

export class TaskCheckerMCPServer {
  private app: express.Application;
  private transports: Map<string, StreamableHTTPServerTransport> = new Map();
  private servers: Map<string, Server> = new Map();
  private sessionTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private readonly SESSION_TIMEOUT_MS = 300000; // 5 minutes

  constructor() {
    // Initialize Express app
    this.app = express();
    this.setupRoutes();
  }

  private createMCPServer(): Server {
    const server = new Server(serverConfig, serverCapabilities);
    server.setRequestHandler(ListToolsRequestSchema, handleListTools);
    server.setRequestHandler(CallToolRequestSchema, handleToolCall);
    return server;
  }

  private setSessionTimeout(sessionId: string): void {
    // Clear existing timeout if any
    const existingTimeout = this.sessionTimeouts.get(sessionId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      console.log(`⏰ Session timeout: ${sessionId}`);
      this.cleanupSession(sessionId);
    }, this.SESSION_TIMEOUT_MS);

    this.sessionTimeouts.set(sessionId, timeout);
  }

  private cleanupSession(sessionId: string): void {
    const transport = this.transports.get(sessionId);
    const server = this.servers.get(sessionId);
    const timeout = this.sessionTimeouts.get(sessionId);

    if (transport) {
      transport.close();
      this.transports.delete(sessionId);
    }

    if (server) {
      server.close();
      this.servers.delete(sessionId);
    }

    if (timeout) {
      clearTimeout(timeout);
      this.sessionTimeouts.delete(sessionId);
    }

    console.log(`🗑️  Cleaned up session: ${sessionId}`);
  }

  private async handleMCPRequest(req: express.Request, res: express.Response): Promise<void> {
    try {
      const sessionId = req.headers['mcp-session-id'] as string;

      let transport: StreamableHTTPServerTransport;
      let server: Server;

      if (sessionId && this.transports.has(sessionId)) {
        // Reuse existing transport for valid session
        transport = this.transports.get(sessionId)!;
        server = this.servers.get(sessionId)!;
        console.log(`📦 Reusing transport for session: ${sessionId}`);
        
        // Reset session timeout on activity
        this.setSessionTimeout(sessionId);
      } else if (!sessionId) {
        // Create new transport for new session (no session ID means initialization)
        const newSessionId = randomUUID();
        
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => newSessionId,
          onsessioninitialized: (sessionId: string) => {
            console.log(`🔗 Session initialized: ${sessionId}`);
            this.transports.set(sessionId, transport);
            this.servers.set(sessionId, server);
            
            // Set timeout for new session
            this.setSessionTimeout(sessionId);
          }
        });

        server = this.createMCPServer();
        await server.connect(transport);
        
        console.log(`🆕 Created new transport for session: ${newSessionId}`);
      } else {
        // Invalid session ID
        res.status(400).json({
          jsonrpc: "2.0",
          error: {
            code: -32600,
            message: "Invalid or expired session"
          },
          id: null
        });
        return;
      }

      // Handle the request with the appropriate transport
      await transport.handleRequest(req, res);

    } catch (error) {
      console.error("Error handling MCP request:", error);
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal error"
        },
        id: null
      });
    }
  }

  private setupRoutes(): void {
    // MCP endpoint (no JSON parsing - transport handles raw stream)
    this.app.all("/mcp", async (req, res) => {
      await this.handleMCPRequest(req, res);
    });

    // Health check
    this.app.get("/health", (req, res) => {
      res.json({
        status: "ok",
        service: "taskchecker-mcp-server",
        transport: "http",
        activeSessions: this.transports.size,
        capabilities: {
          mcp: true,
        },
      });
    });

    // Root endpoint
    this.app.get("/", (req, res) => {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      res.json({
        service: "Task Checker MCP Server",
        version: "1.0.0",
        transport: "http",
        activeSessions: this.transports.size,
        endpoints: {
          mcp: `${baseUrl}/mcp`,
          health: `${baseUrl}/health`,
        },
      });
    });

    // Session cleanup endpoint (for testing)
    this.app.delete("/sessions/:sessionId", (req, res) => {
      const sessionId = req.params.sessionId;
      if (this.transports.has(sessionId)) {
        this.cleanupSession(sessionId);
        res.json({ message: "Session cleaned up", sessionId });
      } else {
        res.status(404).json({ error: "Session not found", sessionId });
      }
    });

    // List active sessions (for debugging)
    this.app.get("/sessions", (req, res) => {
      res.json({
        activeSessions: Array.from(this.transports.keys()),
        count: this.transports.size
      });
    });
  }

  public async start(port: number = 3000): Promise<void> {
    this.app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Task Checker MCP Server (HTTP Transport) running on port ${port}`);
      console.log(`📡 MCP endpoint: http://localhost:${port}/mcp`);
      console.log(`❤️  Health: http://localhost:${port}/health`);
      console.log(`🔧 Sessions endpoint: http://localhost:${port}/sessions`);
    });
  }

  public cleanup(): void {
    console.log(`🧹 Cleaning up ${this.transports.size} active sessions...`);
    
    for (const [sessionId] of this.transports) {
      this.cleanupSession(sessionId);
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});

// Main execution
async function main() {
  const port = parseInt(process.env.PORT || "3000", 10);
  const server = new TaskCheckerMCPServer();
  
  // Cleanup on exit
  process.on('exit', () => {
    server.cleanup();
  });
  
  await server.start(port);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});