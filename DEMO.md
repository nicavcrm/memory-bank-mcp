# Memory Bank MCP Server Demo

This document demonstrates how to use the Memory Bank MCP Server tools.

## Example Workflow

### 1. Initialize a Level 3 Project

**Tool Call:**
```json
{
  "name": "van_mode",
  "arguments": {
    "complexity": "3",
    "task_description": "Implement a user authentication system with JWT tokens, OAuth integration, and role-based access control"
  }
}
```

**Expected Response:**
```
✅ VAN Mode initialized successfully!

**Project Complexity**: Level 3
**Next Mode**: PLAN (detailed planning required)

Memory Bank files have been created and the project structure is ready.
```

**Files Created:**
- `.memory_bank/tasks.md` - Project overview and task tracking
- `.memory_bank/activeContext.md` - Current context and next steps

### 2. Create Implementation Plan

**Tool Call:**
```json
{
  "name": "plan_mode",
  "arguments": {}
}
```

**Expected Response:**
```
✅ PLAN Mode completed!

**Implementation plan created** for Level 3 complexity.
**Next Mode**: CREATIVE

Creative phases identified - design decisions required before implementation.
```

**Files Created:**
- `.memory_bank/implementation-plan.md` - Detailed implementation plan with creative phases identified

### 3. Design Architecture (Creative Phase)

**Tool Call:**
```json
{
  "name": "creative_mode",
  "arguments": {
    "component_name": "auth_system_architecture",
    "creative_type": "architecture",
    "requirements": "Secure authentication with JWT tokens, OAuth integration, role-based access control, scalable to 10k+ users, compatible with REST API"
  }
}
```

**Expected Response:**
```
✅ CREATIVE Mode initialized for auth_system_architecture!

**Creative Type**: architecture
**Status**: Design template created
**Next**: Complete the design options and analysis, then proceed to IMPLEMENT mode.
```

**Files Created:**
- `.memory_bank/creative-auth_system_architecture.md` - Architecture design template with sections for:
  - Requirements & Constraints
  - Multiple Design Options
  - Pros/Cons Analysis
  - Recommended Approach
  - Implementation Guidelines

### 4. Implement Core Components

**Tool Call:**
```json
{
  "name": "implement_mode",
  "arguments": {
    "phase": "core_authentication",
    "complexity": "3"
  }
}
```

**Expected Response:**
```
✅ IMPLEMENT Mode started!

**Complexity**: Level 3
**Phase**: core_authentication
**Status**: Implementation guide created
**Next**: Complete implementation then proceed to REFLECT+ARCHIVE mode.
```

**Files Created:**
- `.memory_bank/progress.md` - Implementation progress tracking

### 5. Reflect on Implementation

**Tool Call:**
```json
{
  "name": "reflect_archive_mode",
  "arguments": {
    "action": "reflect"
  }
}
```

**Expected Response:**
```
✅ REFLECTION completed!

Reflection document created. Please review and complete the reflection sections, then use action "archive" to create the final archive.
```

**Files Created:**
- `.memory_bank/reflection.md` - Implementation reflection template

### 6. Archive Project

**Tool Call:**
```json
{
  "name": "reflect_archive_mode",
  "arguments": {
    "action": "archive"
  }
}
```

**Expected Response:**
```
✅ ARCHIVING completed!

📦 Project archived successfully
📁 Archive location: docs/archive/project-archive.md

🎉 Task fully completed! Ready for next task - use VAN mode to initialize.
```

**Files Created:**
- `.memory_bank/docs/archive/project-archive.md` - Complete project archive
- `.memory_bank/activeContext.md` - Reset for next task

## File Structure After Complete Workflow

```
.memory_bank/
├── tasks.md                                    # ✅ Task tracking (COMPLETED)
├── activeContext.md                            # 🔄 Reset for next task
├── progress.md                                 # 📊 Implementation progress
├── implementation-plan.md                      # 📋 Detailed plan
├── reflection.md                              # 🤔 Implementation reflection
├── creative-auth_system_architecture.md       # 🎨 Architecture design
└── docs/
    └── archive/
        └── project-archive.md                 # 📦 Complete archive
```

## Integration Examples

### Claude Desktop Configuration

Add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "memory-bank": {
      "command": "node",
      "args": ["/path/to/memory-bank-mcp/dist/server.js"]
    }
  }
}
```

### Cursor IDE Integration

Use the MCP client capabilities to connect to the server and access the tools through the IDE.

### VS Code Integration

For VS Code integration, you can use the MCP server with compatible extensions:

#### Option 1: Using MCP Extension (if available)

Install an MCP extension for VS Code and configure it to connect to the Memory Bank server:

```json
// settings.json
{
  "mcp.servers": {
    "memory-bank": {
      "command": "node",
      "args": ["/path/to/memory-bank-mcp/dist/server.js"],
      "cwd": "/path/to/your/workspace"
    }
  }
}
```

#### Option 2: Using Tasks Integration

Create VS Code tasks that interact with the Memory Bank server:

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Memory Bank: Initialize Project",
      "type": "shell",
      "command": "node",
      "args": [
        "-e",
        "const { Client } = require('@modelcontextprotocol/sdk/client/index.js'); const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js'); async function init() { const client = new Client({name: 'vscode-client', version: '1.0.0'}); const transport = new StdioClientTransport({command: 'node', args: ['${workspaceFolder}/dist/server.js']}); await client.connect(transport); const result = await client.callTool({name: 'van_mode', arguments: {complexity: '${input:complexity}', task_description: '${input:taskDescription}'}}); console.log(result.content[0].text); process.exit(0); } init();"
      ],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": []
    },
    {
      "label": "Memory Bank: Create Plan",
      "type": "shell",
      "command": "node",
      "args": [
        "-e",
        "const { Client } = require('@modelcontextprotocol/sdk/client/index.js'); const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js'); async function plan() { const client = new Client({name: 'vscode-client', version: '1.0.0'}); const transport = new StdioClientTransport({command: 'node', args: ['${workspaceFolder}/dist/server.js']}); await client.connect(transport); const result = await client.callTool({name: 'plan_mode', arguments: {}}); console.log(result.content[0].text); process.exit(0); } plan();"
      ],
      "group": "build",
      "dependsOn": "Memory Bank: Initialize Project"
    }
  ],
  "inputs": [
    {
      "id": "complexity",
      "description": "Project complexity level",
      "default": "2",
      "type": "pickString",
      "options": [
        "1",
        "2",
        "3",
        "4"
      ]
    },
    {
      "id": "taskDescription",
      "description": "Task description",
      "default": "Enter task description",
      "type": "promptString"
    }
  ]
}
```

#### Option 3: Using Terminal Commands

Create custom terminal commands or scripts:

```bash
# Create a script: memory-bank.sh
#!/bin/bash

case $1 in
  "init")
    node -e "
      const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
      const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');
      async function init() {
        const client = new Client({name: 'terminal-client', version: '1.0.0'});
        const transport = new StdioClientTransport({
          command: 'node',
          args: ['./dist/server.js']
        });
        await client.connect(transport);
        const result = await client.callTool({
          name: 'van_mode',
          arguments: {complexity: '$2', task_description: '$3'}
        });
        console.log(result.content[0].text);
        process.exit(0);
      }
      init();
    "
    ;;
  "plan")
    node -e "/* similar implementation for plan_mode */"
    ;;
  *)
    echo "Usage: $0 {init|plan|creative|implement|reflect|archive}"
    ;;
esac
```

Usage in VS Code terminal:
```bash
# Initialize project
./memory-bank.sh init 3 "Implement user authentication"

# Create plan
./memory-bank.sh plan

# And so on...
```

### Custom Client Example

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const client = new Client({
  name: 'memory-bank-client',
  version: '1.0.0'
});

const transport = new StdioClientTransport({
  command: 'node',
  args: ['dist/server.js']
});

await client.connect(transport);

// Initialize a project
const result = await client.callTool({
  name: 'van_mode',
  arguments: {
    complexity: '2',
    task_description: 'Fix user login bug'
  }
});

console.log(result.content[0].text);
```

## Tips for Usage

1. **Start with VAN Mode**: Always begin a new project with `van_mode` to set up the proper structure
2. **Follow the Workflow**: Use the suggested mode progression for best results
3. **Complete Creative Phases**: For Level 3-4 projects, fully complete creative phases before implementation
4. **Document Thoroughly**: Use the reflection phase to capture lessons learned
5. **Archive When Done**: Always archive completed projects for future reference

## Complexity Level Guidelines

- **Level 1**: Bug fixes, small patches (VAN → IMPLEMENT → REFLECT+ARCHIVE)
- **Level 2**: Feature enhancements, modifications (VAN → PLAN → IMPLEMENT → REFLECT+ARCHIVE)
- **Level 3**: New features, integrations (VAN → PLAN → CREATIVE → IMPLEMENT → REFLECT+ARCHIVE)
- **Level 4**: Major features, architecture changes (VAN → PLAN → CREATIVE → IMPLEMENT → REFLECT+ARCHIVE)
