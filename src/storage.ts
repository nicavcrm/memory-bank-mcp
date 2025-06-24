// src/storage.ts
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const MEMORY_BANK_DIR = ".memory_bank";

export class MemoryBankStorage {
  constructor() {
    mkdirSync(MEMORY_BANK_DIR, { recursive: true });
  }

  getFilePath(filename: string): string {
    return join(MEMORY_BANK_DIR, filename);
  }

  readFile(filename: string): string {
    try {
      return readFileSync(this.getFilePath(filename), "utf-8");
    } catch {
      return "";
    }
  }

  writeFile(filename: string, content: string): void {
    writeFileSync(this.getFilePath(filename), content);
  }

  // Mode-specific file handlers

  getTasks() {
    return this.readFile("tasks.md");
  }
  setTasks(content: string) {
    this.writeFile("tasks.md", content);
  }

  getActiveContext() {
    return this.readFile("activeContext.md");
  }
  setActiveContext(content: string) {
    this.writeFile("activeContext.md", content);
  }

  getProgress() {
    return this.readFile("progress.md");
  }

  setProgress(content: string) {
    this.writeFile("progress.md", content);
  }

  getCreativeContent(filename: string) {
    return this.readFile(`creative-${filename}.md`);
  }

  setCreativeContent(filename: string, content: string) {
    this.writeFile(`creative-${filename}.md`, content);
  }

  getImplementationPlan() {
    return this.readFile("implementation-plan.md");
  }

  setImplementationPlan(content: string) {
    this.writeFile("implementation-plan.md", content);
  }

  getReflection() {
    return this.readFile("reflection.md");
  }

  setReflection(content: string) {
    this.writeFile("reflection.md", content);
  }

  // Ensure docs/archive directory exists and write archive
  writeArchive(content: string) {
    try {
      mkdirSync(this.getFilePath("docs/archive"), { recursive: true });
      this.writeFile("docs/archive/project-archive.md", content);
    } catch (error) {
      // Fallback to root level if directory creation fails
      this.writeFile("project-archive.md", content);
    }
  }
}
