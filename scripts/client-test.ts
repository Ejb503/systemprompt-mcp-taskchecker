#!/usr/bin/env node
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

async function testMCPServer() {
  console.log("🔌 Connecting to MCP Server...");
  
  // Create HTTP transport
  const transport = new StreamableHTTPClientTransport(
    new URL("http://127.0.0.1:3000/mcp")
  );

  // Create client
  const client = new Client(
    {
      name: "test-client",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  try {
    // Connect to server
    await client.connect(transport);
    console.log("✅ Connected to MCP Server");

    // List available tools
    console.log("\n📋 Listing available tools...");
    const toolsResult = await client.listTools();
    
    console.log("Available tools:");
    toolsResult.tools.forEach((tool: any) => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });

    // Test 1: Create a task list
    console.log("\n🆕 Testing create_tasklist...");
    const createResult = await client.callTool({
      name: "create_tasklist",
      arguments: {
        initialTasks: [
          {
            title: "Write unit tests",
            acceptanceCriteria: "All tests pass with >90% coverage"
          },
          {
            title: "Deploy to staging",
            acceptanceCriteria: "Application runs without errors on staging server"
          }
        ]
      }
    });

    console.log("Create result:", (createResult as any).content[0].text);
    const createData = JSON.parse((createResult as any).content[0].text);
    const taskListId = createData.data.id;
    const firstTaskId = createData.data.tasks[0].id;

    // Test 2: Update a task
    console.log("\n✏️  Testing update_task...");
    const updateResult = await client.callTool({
      name: "update_task",
      arguments: {
        taskListId: taskListId,
        taskId: firstTaskId,
        updates: {
          status: "in_progress",
          evaluation: 75
        }
      }
    });

    console.log("Update result:", (updateResult as any).content[0].text);

    // Test 3: Get status of all tasks
    console.log("\n📊 Testing get_status (all tasks)...");
    const statusAllResult = await client.callTool({
      name: "get_status",
      arguments: {
        taskListId: taskListId
      }
    });

    console.log("Status (all tasks):", (statusAllResult as any).content[0].text);

    // Test 4: Get status of specific task
    console.log("\n🔍 Testing get_status (specific task)...");
    const statusOneResult = await client.callTool({
      name: "get_status",
      arguments: {
        taskListId: taskListId,
        taskId: firstTaskId
      }
    });

    console.log("Status (specific task):", (statusOneResult as any).content[0].text);

    // Test 5: Complete a task with evaluation
    console.log("\n✅ Testing task completion...");
    const completeResult = await client.callTool({
      name: "update_task",
      arguments: {
        taskListId: taskListId,
        taskId: firstTaskId,
        updates: {
          status: "completed",
          evaluation: 95
        }
      }
    });

    console.log("Completion result:", (completeResult as any).content[0].text);

    console.log("\n🎉 All tests completed successfully!");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
    console.log("🔌 Disconnected from MCP Server");
  }
}

// Run the test
testMCPServer().catch(console.error);