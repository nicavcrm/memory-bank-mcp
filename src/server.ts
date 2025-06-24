import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { MemoryBankTools } from './tools.js';

class MemoryBankServer {
  private server: McpServer;
  private tools: MemoryBankTools;

  constructor() {
    this.server = new McpServer({
      name: 'memory-bank-mcp',
      version: '1.0.0',
    });

    this.tools = new MemoryBankTools();
    this.setupTools();
  }

  private setupTools(): void {
    // VAN Mode Tool
    this.server.registerTool(
      'van_mode',
      {
        title: 'VAN Mode',
        description: 'Initialize project and determine complexity level. Entry point for the Memory Bank system.',
        inputSchema: {
          complexity: z.string().refine(val => ['1', '2', '3', '4'].includes(val), {
            message: 'Complexity must be 1, 2, 3, or 4'
          }),
          task_description: z.string().optional()
        }
      },
      async (args) => {
        return await (this.tools.vanModeTool.handler as any)(args);
      }
    );

    // PLAN Mode Tool
    this.server.registerTool(
      'plan_mode',
      {
        title: 'PLAN Mode',
        description: 'Create detailed implementation plan based on complexity level',
        inputSchema: {
          complexity: z.string().refine(val => ['1', '2', '3', '4'].includes(val), {
            message: 'Complexity must be 1, 2, 3, or 4'
          }).optional()
        }
      },
      async (args) => {
        return await (this.tools.planModeTool.handler as any)(args);
      }
    );

    // CREATIVE Mode Tool
    this.server.registerTool(
      'creative_mode',
      {
        title: 'CREATIVE Mode',
        description: 'Design and architecture work for complex components',
        inputSchema: {
          component_name: z.string(),
          creative_type: z.enum(['architecture', 'algorithm', 'uiux']),
          requirements: z.string()
        }
      },
      async (args) => {
        return await (this.tools.creativeTool.handler as any)(args);
      }
    );

    // IMPLEMENT Mode Tool
    this.server.registerTool(
      'implement_mode',
      {
        title: 'IMPLEMENT Mode',
        description: 'Execute the implementation based on plan and creative decisions',
        inputSchema: {
          phase: z.string().optional(),
          complexity: z.string().refine(val => ['1', '2', '3', '4'].includes(val), {
            message: 'Complexity must be 1, 2, 3, or 4'
          }).optional()
        }
      },
      async (args) => {
        return await (this.tools.implementTool.handler as any)(args);
      }
    );

    // REFLECT+ARCHIVE Mode Tool
    this.server.registerTool(
      'reflect_archive_mode',
      {
        title: 'REFLECT+ARCHIVE Mode',
        description: 'Reflect on implementation and archive documentation',
        inputSchema: {
          action: z.enum(['reflect', 'archive'])
        }
      },
      async (args) => {
        return await (this.tools.reflectArchiveTool.handler as any)(args);
      }
    );
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

// Start the server
const server = new MemoryBankServer();
server.run().catch(console.error);
