import { MemoryBankStorage } from './storage.js';

interface VanModeInput {
  complexity: '1' | '2' | '3' | '4';
  task_description?: string;
}

interface PlanModeInput {
  complexity?: '1' | '2' | '3' | '4';
}

interface CreativeModeInput {
  component_name: string;
  creative_type: 'architecture' | 'algorithm' | 'uiux';
  requirements: string;
}

interface ImplementModeInput {
  phase?: string;
  complexity?: '1' | '2' | '3' | '4';
}

interface ReflectArchiveInput {
  action: 'reflect' | 'archive';
}

interface ToolResponse {
  content: Array<{ type: 'text'; text: string }>;
}

type ToolHandler<T> = (input: T) => Promise<ToolResponse>;

interface MemoryBankTool<T = any> {
  name: string;
  description: string;
  inputSchema: any;
  handler: ToolHandler<T>;
}

export class MemoryBankTools {
  private storage: MemoryBankStorage;

  constructor() {
    this.storage = new MemoryBankStorage();
  }

  // VAN Mode Tool
  vanModeTool: MemoryBankTool<VanModeInput> = {
    name: 'van_mode',
    description: 'Initialize project and determine complexity level. Entry point for the Memory Bank system.',
    inputSchema: {
      type: 'object',
      properties: {
        complexity: {
          type: 'string',
          enum: ['1', '2', '3', '4'],
          description: 'Level 1: Quick bug fix, Level 2: Simple enhancement, Level 3-4: Complex features'
        },
        task_description: {
          type: 'string',
          description: 'Description of the task to be implemented'
        }
      },
      required: ['complexity']
    },
    handler: async (input: VanModeInput): Promise<ToolResponse> => {
      const timestamp = new Date().toISOString();
      const template = `# Memory Bank System

## Project Overview
- **Complexity Level**: ${input.complexity}
- **Task**: ${input.task_description || 'Task description pending'}
- **Initialized**: ${timestamp}

## Status
- [ ] VAN Mode: Project initialization
- [ ] PLAN Mode: Implementation planning
- [ ] CREATIVE Mode: Design decisions (if required)
- [ ] IMPLEMENT Mode: Code implementation
- [ ] REFLECT+ARCHIVE Mode: Completion and documentation

## Current Phase: VAN
**Next Steps**: ${input.complexity === '1' ? 'Proceed directly to IMPLEMENT mode' : 'Move to PLAN mode for detailed planning'}

## Memory Bank Files
- tasks.md: ✅ Initialized
- activeContext.md: Pending
- progress.md: Pending
- implementation-plan.md: Pending
`;

      this.storage.setTasks(template);

      const activeContext = `# Active Context

## Current Task
${input.task_description || 'Task description pending'}

## Complexity Level: ${input.complexity}
${this.getComplexityDescription(input.complexity)}

## Current Mode: VAN
- Status: Completed
- Next Mode: ${input.complexity === '1' ? 'IMPLEMENT' : 'PLAN'}
`;

      this.storage.setActiveContext(activeContext);

      return {
        content: [{
          type: 'text',
          text: `✅ VAN Mode initialized successfully!\n\n**Project Complexity**: Level ${input.complexity}\n**Next Mode**: ${input.complexity === '1' ? 'IMPLEMENT (direct implementation)' : 'PLAN (detailed planning required)'}\n\nMemory Bank files have been created and the project structure is ready.`
        }]
      };
    }
  };

  // PLAN Mode Tool
  planModeTool: MemoryBankTool<PlanModeInput> = {
    name: 'plan_mode',
    description: 'Create detailed implementation plan based on complexity level',
    inputSchema: {
      type: 'object',
      properties: {
        complexity: {
          type: 'string',
          enum: ['1', '2', '3', '4'],
          description: 'Complexity level (optional, will read from tasks.md if not provided)'
        }
      }
    },
    handler: async (input: PlanModeInput): Promise<ToolResponse> => {
      const currentTasks = this.storage.getTasks();
      const complexity = input.complexity || this.extractComplexityFromTasks(currentTasks);

      if (!complexity) {
        return {
          content: [{
            type: 'text',
            text: '❌ Error: Complexity level not found. Please run VAN mode first or specify complexity level.'
          }]
        };
      }

      const planTemplate = this.generatePlanTemplate(complexity);
      this.storage.setImplementationPlan(planTemplate);

      // Update tasks.md
      const updatedTasks = currentTasks.replace(
        '- [ ] PLAN Mode: Implementation planning',
        '- [x] PLAN Mode: Implementation planning ✅'
      ).replace(
        'Current Phase: VAN',
        'Current Phase: PLAN'
      );

      this.storage.setTasks(updatedTasks);

      const requiresCreative = complexity === '3' || complexity === '4';
      const nextMode = requiresCreative ? 'CREATIVE' : 'IMPLEMENT';

      return {
        content: [{
          type: 'text',
          text: `✅ PLAN Mode completed!\n\n**Implementation plan created** for Level ${complexity} complexity.\n**Next Mode**: ${nextMode}\n\n${requiresCreative ? 'Creative phases identified - design decisions required before implementation.' : 'Ready for direct implementation.'}`
        }]
      };
    }
  };

  // CREATIVE Mode Tool
  creativeTool: MemoryBankTool<CreativeModeInput> = {
    name: 'creative_mode',
    description: 'Design and architecture work for complex components',
    inputSchema: {
      type: 'object',
      properties: {
        component_name: {
          type: 'string',
          description: 'Name of the component requiring creative design'
        },
        creative_type: {
          type: 'string',
          enum: ['architecture', 'algorithm', 'uiux'],
          description: 'Type of creative work needed'
        },
        requirements: {
          type: 'string',
          description: 'Requirements and constraints for the component'
        }
      },
      required: ['component_name', 'creative_type', 'requirements']
    },
    handler: async (input: CreativeModeInput): Promise<ToolResponse> => {
      const timestamp = new Date().toISOString();
      const creativeDoc = `# 🎨🎨🎨 ENTERING CREATIVE PHASE: ${input.creative_type.toUpperCase()}

## Component: ${input.component_name}
**Type**: ${input.creative_type}
**Started**: ${timestamp}

## Requirements & Constraints
${input.requirements}

## Design Options
*To be filled with multiple design approaches*

### Option 1: [Name]
**Pros:**
-

**Cons:**
-

### Option 2: [Name]
**Pros:**
-

**Cons:**
-

## Recommended Approach
*Selection with justification*

## Implementation Guidelines
*How to implement the selected solution*

## Verification
*Does solution meet requirements?*

# 🎨🎨🎨 EXITING CREATIVE PHASE
`;

      this.storage.setCreativeContent(input.component_name, creativeDoc);

      // Update tasks
      const currentTasks = this.storage.getTasks();
      const updatedTasks = currentTasks.replace(
        '- [ ] CREATIVE Mode: Design decisions (if required)',
        '- [x] CREATIVE Mode: Design decisions ✅'
      );
      this.storage.setTasks(updatedTasks);

      return {
        content: [{
          type: 'text',
          text: `✅ CREATIVE Mode initialized for ${input.component_name}!\n\n**Creative Type**: ${input.creative_type}\n**Status**: Design template created\n**Next**: Complete the design options and analysis, then proceed to IMPLEMENT mode.`
        }]
      };
    }
  };

  // IMPLEMENT Mode Tool
  implementTool: MemoryBankTool<ImplementModeInput> = {
    name: 'implement_mode',
    description: 'Execute the implementation based on plan and creative decisions',
    inputSchema: {
      type: 'object',
      properties: {
        phase: {
          type: 'string',
          description: 'Implementation phase (for complex projects)'
        },
        complexity: {
          type: 'string',
          enum: ['1', '2', '3', '4'],
          description: 'Complexity level (optional, will read from tasks.md if not provided)'
        }
      }
    },
    handler: async (input: ImplementModeInput): Promise<ToolResponse> => {
      const currentTasks = this.storage.getTasks();
      const complexity = input.complexity || this.extractComplexityFromTasks(currentTasks);

      if (!complexity) {
        return {
          content: [{
            type: 'text',
            text: '❌ Error: Complexity level not found. Please run VAN mode first.'
          }]
        };
      }

      const implementationGuide = this.generateImplementationGuide(complexity, input.phase);

      // Update progress
      const progress = `# Implementation Progress

## Phase: ${input.phase || 'Main Implementation'}
**Complexity Level**: ${complexity}
**Started**: ${new Date().toISOString()}

## Build Steps
${implementationGuide}

## Status
- [ ] Core implementation
- [ ] Testing
- [ ] Integration
- [ ] Documentation

## Notes
*Implementation notes and decisions*
`;

      this.storage.setProgress(progress);

      // Update tasks
      const updatedTasks = currentTasks.replace(
        '- [ ] IMPLEMENT Mode: Code implementation',
        '- [x] IMPLEMENT Mode: Code implementation ✅'
      );
      this.storage.setTasks(updatedTasks);

      return {
        content: [{
          type: 'text',
          text: `✅ IMPLEMENT Mode started!\n\n**Complexity**: Level ${complexity}\n**Phase**: ${input.phase || 'Main Implementation'}\n**Status**: Implementation guide created\n**Next**: Complete implementation then proceed to REFLECT+ARCHIVE mode.`
        }]
      };
    }
  };

  // REFLECT+ARCHIVE Mode Tool
  reflectArchiveTool: MemoryBankTool<ReflectArchiveInput> = {
    name: 'reflect_archive_mode',
    description: 'Reflect on implementation and archive documentation',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['reflect', 'archive'],
          description: 'reflect: Review implementation, archive: Create final documentation (requires ARCHIVE NOW command)'
        }
      },
      required: ['action']
    },
    handler: async (input: ReflectArchiveInput): Promise<ToolResponse> => {
      if (input.action === 'reflect') {
        return this.handleReflection();
      } else if (input.action === 'archive') {
        return this.handleArchiving();
      }

      return {
        content: [{
          type: 'text',
          text: '❌ Invalid action. Use "reflect" or "archive".'
        }]
      };
    }
  };

  // Helper Methods
  private getComplexityDescription(complexity: string): string {
    const descriptions = {
      '1': 'Quick bug fix - Direct implementation, minimal planning required',
      '2': 'Simple enhancement - Streamlined planning, straightforward implementation',
      '3': 'Complex feature - Comprehensive planning, creative phases may be required',
      '4': 'Major feature/refactor - Detailed architecture, phased implementation, creative design required'
    };
    return descriptions[complexity as keyof typeof descriptions] || 'Unknown complexity level';
  }

  private extractComplexityFromTasks(tasks: string): string | null {
    const match = tasks.match(/Complexity Level\*\*: (\d)/);
    return match ? match[1] : null;
  }

  private generatePlanTemplate(complexity: string): string {
    const timestamp = new Date().toISOString();

    if (complexity === '1') {
      return `# Implementation Plan - Level 1 (Quick Fix)

## Overview
Quick bug fix implementation plan.

## Implementation Steps
1. Identify the bug location
2. Implement targeted fix
3. Test the fix
4. Verify no regression

## Files to Modify
*List files that need changes*

## Testing Strategy
*How to verify the fix works*

**Created**: ${timestamp}
`;
    } else if (complexity === '2') {
      return `# Implementation Plan - Level 2 (Simple Enhancement)

## Overview of Changes
*Describe what needs to be enhanced*

## Files to Modify
*List files that need changes*

## Implementation Steps
1. *Step 1*
2. *Step 2*
3. *Step 3*

## Potential Challenges
*List any anticipated issues*

## Testing Strategy
*How to test the enhancement*

**Created**: ${timestamp}
`;
    } else {
      return `# Implementation Plan - Level ${complexity} (Complex Feature)

## Requirements Analysis
*Detailed requirements breakdown*

## Components Affected
*List all components that will be modified or created*

## Architecture Considerations
*High-level architectural decisions*

## Creative Phase Components
*Components requiring design decisions:*
- [ ] Architecture Design: *Component name*
- [ ] Algorithm Design: *Component name*
- [ ] UI/UX Design: *Component name*

## Implementation Strategy
*Overall approach to implementation*

## Detailed Steps
### Phase 1: Core Components
1. *Step 1*
2. *Step 2*

### Phase 2: Secondary Components
1. *Step 1*
2. *Step 2*

### Phase 3: Integration & Polish
1. *Step 1*
2. *Step 2*

## Dependencies
*External and internal dependencies*

## Challenges & Mitigations
*Potential issues and solutions*

**Created**: ${timestamp}
`;
    }
  }

  private generateImplementationGuide(complexity: string, phase?: string): string {
    if (complexity === '1') {
      return `### Level 1 Build Process:
1. 🔍 Review bug report
2. 👁️ Examine relevant code
3. ⚒️ Implement targeted fix
4. ✅ Test fix
5. 📝 Update documentation`;
    } else if (complexity === '2') {
      return `### Level 2 Build Process:
1. 📋 Follow build plan
2. 🔨 Build each component
3. ✅ Test each component
4. 🔄 Verify integration
5. 📝 Document build details`;
    } else {
      return `### Level ${complexity} Build Process:
**Phase**: ${phase || 'Core Implementation'}

1. 🎨 Review creative phase decisions
2. 🏗️ Build in planned phases
3. ✅ Test each phase thoroughly
4. 🔄 Integration testing
5. 📝 Detailed documentation
6. 🔍 Comprehensive review`;
    }
  }

  private handleReflection(): Promise<ToolResponse> {
    const timestamp = new Date().toISOString();
    const reflectionDoc = `# Implementation Reflection

## Implementation Review
**Completed**: ${timestamp}

### What Went Well (Successes)
- *Document successful aspects of the implementation*

### Challenges Encountered
- *Document difficulties and how they were resolved*

### Lessons Learned
- *Key insights from this implementation*

### Process Improvements
- *Suggestions for improving the development process*

### Technical Improvements
- *Technical insights and potential optimizations*

## Comparison to Plan
*How did the actual implementation compare to the original plan?*

## Final Status
- [ ] Implementation complete
- [ ] Testing complete
- [ ] Documentation complete
- [ ] Ready for archive

**Next Step**: Type 'ARCHIVE NOW' to proceed with archiving.
`;

    this.storage.writeFile('reflection.md', reflectionDoc);

    // Update tasks
    const currentTasks = this.storage.getTasks();
    const updatedTasks = currentTasks.replace(
      '- [ ] REFLECT+ARCHIVE Mode: Completion and documentation',
      '- [x] REFLECT+ARCHIVE Mode: Reflection complete ✅'
    );
    this.storage.setTasks(updatedTasks);

    return Promise.resolve({
      content: [{
        type: 'text',
        text: '✅ REFLECTION completed!\n\nReflection document created. Please review and complete the reflection sections, then use action "archive" to create the final archive.'
      }]
    });
  }

  private handleArchiving(): Promise<ToolResponse> {
    const timestamp = new Date().toISOString();
    const tasks = this.storage.getTasks();
    const reflection = this.storage.readFile('reflection.md');
    const plan = this.storage.readFile('implementation-plan.md');
    const progress = this.storage.getProgress();

    // Create archive document
    const archiveDoc = `# Project Archive

**Archived**: ${timestamp}

## Project Summary
${this.extractProjectSummary(tasks)}

## Implementation Plan
${plan}

## Implementation Progress
${progress}

## Reflection
${reflection}

## Final Status
✅ Project completed and archived

## Files Included
- tasks.md
- implementation-plan.md
- progress.md
- reflection.md
- All creative phase documents

---
*This archive represents the complete documentation of the project lifecycle.*
`;

    this.storage.writeArchive(archiveDoc);

    // Update tasks - mark as COMPLETED
    const finalTasks = tasks.replace(
      'REFLECT+ARCHIVE Mode: Reflection complete ✅',
      'REFLECT+ARCHIVE Mode: Completed and Archived ✅'
    ).replace(
      'Current Phase: PLAN',
      'Current Phase: COMPLETED'
    );
    this.storage.setTasks(finalTasks);

    // Reset active context for next task
    this.storage.setActiveContext(`# Active Context

## Status: Ready for New Task
Previous task has been completed and archived.

**Next Steps**: Use VAN mode to initialize a new task.

**Archive Location**: docs/archive/project-archive.md
`);

    return Promise.resolve({
      content: [{
        type: 'text',
        text: '✅ ARCHIVING completed!\n\n📦 Project archived successfully\n📁 Archive location: docs/archive/project-archive.md\n\n🎉 Task fully completed! Ready for next task - use VAN mode to initialize.'
      }]
    });
  }

  private extractProjectSummary(tasks: string): string {
    const lines = tasks.split('\n');
    const overviewStart = lines.findIndex(line => line.includes('## Project Overview'));
    if (overviewStart === -1) return 'Project summary not available';

    const overviewEnd = lines.findIndex((line, index) =>
      index > overviewStart && line.startsWith('## ') && !line.includes('Project Overview')
    );

    return lines.slice(overviewStart, overviewEnd === -1 ? undefined : overviewEnd).join('\n');
  }

  // Remove this old comment since we've implemented all modes
  getAllTools(): MemoryBankTool[] {
    return [
      this.vanModeTool,
      this.planModeTool,
      this.creativeTool,
      this.implementTool,
      this.reflectArchiveTool
    ];
  }
}
