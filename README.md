# Memory Bank MCP Server

A Model Context Protocol (MCP) server implementing the Memory Bank system based on the [cursor-memory-bank](https://github.com/vanzan01/cursor-memory-bank) custom modes.

<a href="https://glama.ai/mcp/servers/@nicavcrm/memory-bank-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@nicavcrm/memory-bank-mcp/badge" alt="Memory Bank Server MCP server" />
</a>

## Overview

This MCP server provides structured workflow tools for managing software development projects through different complexity levels and phases:

- **VAN Mode**: Project initialization and complexity assessment
- **PLAN Mode**: Detailed implementation planning
- **CREATIVE Mode**: Design and architecture decisions
- **IMPLEMENT Mode**: Code implementation and execution
- **REFLECT+ARCHIVE Mode**: Project reflection and documentation archiving

## Features

### 🎯 **VAN Mode** (Entry Point)
- Initialize new projects with complexity levels 1-4
- Set up Memory Bank file structure
- Determine appropriate next mode based on complexity

### 📋 **PLAN Mode** (Planning)
- Generate implementation plans based on complexity level
- Create detailed step-by-step approaches
- Identify components requiring creative phases

### 🎨 **CREATIVE Mode** (Design)
- Architecture design with multiple options analysis
- Algorithm design with complexity considerations
- UI/UX design with accessibility and usability focus
- Structured documentation of design decisions

### ⚒️ **IMPLEMENT Mode** (Execution)
- Phase-based implementation for complex projects
- Integration testing and documentation
- Progress tracking and status updates

### 🤔 **REFLECT+ARCHIVE Mode** (Completion)
- Implementation reflection and lessons learned
- Complete project archiving
- Preparation for next task initialization

## Installation

```bash
npm install
npm run build
```

## Usage

### Running the Server

```bash
npm start
```

### Available Tools

#### 1. `van_mode`
Initialize a project with complexity assessment.

**Parameters:**
- `complexity` (required): "1" | "2" | "3" | "4"
  - Level 1: Quick bug fix
  - Level 2: Simple enhancement
  - Level 3: Complex feature
  - Level 4: Major feature/refactor
- `task_description` (optional): Description of the task

**Example:**
```json
{
  "complexity": "3",
  "task_description": "Implement user authentication system"
}
```

#### 2. `plan_mode`
Create detailed implementation plan.

**Parameters:**
- `complexity` (optional): Complexity level (reads from tasks.md if not provided)

#### 3. `creative_mode`
Perform design and architecture work.

**Parameters:**
- `component_name` (required): Name of component requiring design
- `creative_type` (required): "architecture" | "algorithm" | "uiux"
- `requirements` (required): Requirements and constraints

**Example:**
```json
{
  "component_name": "user_auth_system",
  "creative_type": "architecture",
  "requirements": "Secure authentication with JWT tokens, OAuth integration, and role-based access control"
}
```

#### 4. `implement_mode`
Execute implementation based on plan.

**Parameters:**
- `phase` (optional): Implementation phase for complex projects
- `complexity` (optional): Complexity level (reads from tasks.md if not provided)

#### 5. `reflect_archive_mode`
Reflect on implementation and archive documentation.

**Parameters:**
- `action` (required): "reflect" | "archive"
  - "reflect": Review and document implementation experience
  - "archive": Create final documentation archive

## Memory Bank Files

The server creates and manages several files in the `.memory_bank` directory:

- `tasks.md`: Main task tracking and status
- `activeContext.md`: Current context and focus
- `progress.md`: Implementation progress tracking
- `implementation-plan.md`: Detailed implementation plan
- `reflection.md`: Post-implementation reflection
- `creative-{component}.md`: Creative phase documentation
- `docs/archive/project-archive.md`: Final project archive

## Workflow Example

```bash
# 1. Initialize project
van_mode(complexity="3", task_description="Build REST API")

# 2. Create implementation plan
plan_mode()

# 3. Design complex components (if Level 3-4)
creative_mode(component_name="api_architecture", creative_type="architecture", requirements="...")

# 4. Implement the solution
implement_mode(phase="core_components")

# 5. Reflect and archive
reflect_archive_mode(action="reflect")
reflect_archive_mode(action="archive")
```

## Complexity Levels

- **Level 1**: Quick bug fixes - Direct implementation, minimal planning
- **Level 2**: Simple enhancements - Streamlined planning, straightforward implementation
- **Level 3**: Complex features - Comprehensive planning, creative phases may be required
- **Level 4**: Major features/refactors - Detailed architecture, phased implementation, creative design required

## Development

```bash
# Development mode with auto-reload
npm run dev

# Build TypeScript
npm run build

# Run compiled server
npm start
```

## Troubleshooting

### Module Resolution Errors

If you encounter `ERR_MODULE_NOT_FOUND` errors when running the server, ensure:

1. **Build First**: Always run `npm run build` before `npm start`
2. **ES Module Imports**: All imports in source files use `.js` extensions
3. **TypeScript Config**: The `tsconfig.json` is configured for ES modules with `"module": "ESNext"`

```bash
# Clean build if issues persist
rm -rf dist/
npm run build
npm start
```

### Memory Bank Directory Permissions

If the server can't create the `.memory_bank` directory:

```bash
# Ensure write permissions in the working directory
chmod 755 .
```

## Integration

This MCP server can be integrated with:
- **Claude Desktop**: Add to MCP server configuration
- **Cursor IDE**: Use with MCP client capabilities
- **VS Code**: Through MCP extensions
- **Custom clients**: Any MCP-compatible application

## Based On

This implementation is based on the excellent [cursor-memory-bank](https://github.com/vanzan01/cursor-memory-bank) project by vanzan01, adapted for use as an MCP server.

## License

MIT
