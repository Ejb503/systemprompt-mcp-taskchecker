import { Implementation, ServerCapabilities } from "@modelcontextprotocol/sdk/types.js";

/**
 * Comprehensive server configuration for SystemPrompt MCP TaskChecker
 * 
 * This configuration defines the complete initialization parameters for the
 * Model Context Protocol server, including metadata, capabilities, security
 * settings, and operational limits.
 * 
 * Built by SystemPrompt.io - https://systemprompt.io
 */
export const serverConfig: Implementation = {
  name: "systemprompt-mcp-taskchecker",
  version: "1.0.0",
  metadata: {
    // Core Identity
    name: "SystemPrompt MCP TaskChecker",
    description: "Enterprise-grade Model Context Protocol server for intelligent task management, evaluation scoring, and session-based workflow tracking. Seamlessly integrates with AI assistants to provide structured task orchestration, real-time progress monitoring, and comprehensive evaluation metrics. Built by SystemPrompt.io for next-generation AI-driven productivity solutions.",
    
    // Visual Identity
    icon: "solar:checklist-line-duotone",
    color: "success",
    
    // Attribution & Links
    vendor: "SystemPrompt.io",
    website: "https://systemprompt.io",
    repository: "https://github.com/Ejb503/systemprompt-mcp-taskchecker",
    documentation: "https://github.com/Ejb503/systemprompt-mcp-taskchecker#readme",
    
    // Technical Metadata
    serverStartTime: Date.now(),
    environment: process.env.NODE_ENV || "production",
    protocolVersion: "2025-03-26",
    transportType: "streamable-http",
    
    // Advanced Configuration
    customData: {
      // Server Feature Flags
      serverFeatures: [
        "task-management",
        "session-based-storage", 
        "evaluation-scoring",
        "workflow-tracking",
        "real-time-updates",
        "mcp-compliant",
        "enterprise-ready",
        "systemprompt-powered",
        "ai-assistant-integration",
        "structured-responses"
      ],
      
      // Detailed Capabilities Matrix
      capabilities: {
        taskManagement: {
          create: true,
          update: true,
          delete: false, // Intentionally disabled for data integrity
          evaluation: true,
          statusTracking: true,
          bulkOperations: false,
          templateSupport: false
        },
        sessionManagement: {
          stateful: true,
          timeout: 300000, // 5 minutes
          cleanup: true,
          validation: true,
          concurrent: true,
          persistence: false // In-memory only
        },
        security: {
          sessionValidation: true,
          inputValidation: true,
          errorHandling: true,
          rateLimiting: false,
          authentication: false, // Public MCP server
          encryption: false // Transport-level security
        },
        performance: {
          caching: true,
          compression: false,
          clustering: false,
          monitoring: true
        }
      },
      
      // Operational Limits
      limits: {
        maxTasksPerList: 100,
        maxTaskLists: 5,
        maxSessionDuration: 300000, // 5 minutes
        maxConcurrentSessions: 1000,
        evaluationRange: { min: 0, max: 100 },
        titleMaxLength: 255,
        criteriaMaxLength: 1000,
        sessionIdLength: 36
      },
      
      // Integration Specifications
      integration: {
        mcpVersion: "2025-03-26",
        supportedTransports: ["streamable-http"],
        responseFormat: "json",
        errorHandling: "structured",
        logging: {
          level: process.env.LOG_LEVEL || "info",
          structured: true,
          includeSessionId: true
        }
      },
      
      // SystemPrompt.io Branding
      systemPrompt: {
        poweredBy: "SystemPrompt.io",
        brandingUrl: "https://systemprompt.io",
        attribution: "Built by SystemPrompt.io - Advanced AI Productivity Solutions",
        version: "enterprise-v1.0",
        support: "https://systemprompt.io/support",
        documentation: "https://systemprompt.io/docs/mcp-taskchecker"
      }
    }
  }
};

export const serverCapabilities: { capabilities: ServerCapabilities } = {
  capabilities: {
    tools: {
      listChanged: false, // Tool list is static
    },
    logging: {
      level: process.env.LOG_LEVEL || "info",
    },
    experimental: {},
  },
};