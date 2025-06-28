'use server';

import fs from 'fs';
import path from 'path';

export interface Problem {
  id: string;
  title: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  description: string;
  solutions: Solution[];
}

export interface Solution {
  language: string;
  code: string;
  filename: string;
}

const PROBLEMS_DIR = process.cwd();

export async function getAllProblems(): Promise<Problem[]> {
  try {
    const entries = fs.readdirSync(PROBLEMS_DIR, { withFileTypes: true });
    const problemDirs = entries
      .filter(entry => entry.isDirectory() && /^\d+-.+/.test(entry.name))
      .sort((a, b) => {
        const aNum = parseInt(a.name.split('-')[0]);
        const bNum = parseInt(b.name.split('-')[0]);
        return aNum - bNum;
      });

    const problems: Problem[] = [];

    for (const dir of problemDirs) {
      const problemPath = path.join(PROBLEMS_DIR, dir.name);
      const problem = await parseProblem(dir.name, problemPath);
      if (problem) {
        problems.push(problem);
      }
    }

    return problems;
  } catch (error) {
    console.error('Error reading problems:', error);
    return [];
  }
}

export async function getProblemById(id: string): Promise<Problem | null> {
  try {
    const problemPath = path.join(PROBLEMS_DIR, id);
    if (!fs.existsSync(problemPath)) {
      return null;
    }
    return await parseProblem(id, problemPath);
  } catch (error) {
    console.error('Error reading problem:', error);
    return null;
  }
}

async function parseProblem(dirName: string, problemPath: string): Promise<Problem | null> {
  try {
    const files = fs.readdirSync(problemPath);
    
    // Read README.md for description
    const readmePath = path.join(problemPath, 'README.md');
    let description = '';
    let title = dirName;
    let difficulty: 'Easy' | 'Medium' | 'Hard' | undefined;

    if (fs.existsSync(readmePath)) {
      const readmeContent = fs.readFileSync(readmePath, 'utf-8');
      description = readmeContent;
      
      // Extract title from markdown
      const titleRegex = /<h2><a[^>]*>(\d+\.\s*[^<]+)<\/a><\/h2>/;
      const titleMatch = titleRegex.exec(readmeContent);
      if (titleMatch) {
        title = titleMatch[1];
      }
      
      // Extract difficulty
      const difficultyRegex = /<h3>(Easy|Medium|Hard)<\/h3>/;
      const difficultyMatch = difficultyRegex.exec(readmeContent);
      if (difficultyMatch) {
        difficulty = difficultyMatch[1] as 'Easy' | 'Medium' | 'Hard';
      }
    }

    // Read solution files
    const solutions: Solution[] = [];
    const solutionFiles = files.filter(file => 
      file.endsWith('.py') || 
      file.endsWith('.js') || 
      file.endsWith('.java') || 
      file.endsWith('.cpp') ||
      file.endsWith('.c') ||
      file.endsWith('.ts')
    );

    for (const file of solutionFiles) {
      const filePath = path.join(problemPath, file);
      const code = fs.readFileSync(filePath, 'utf-8');
      const language = getLanguageFromExtension(path.extname(file));
      
      solutions.push({
        language,
        code,
        filename: file
      });
    }

    return {
      id: dirName,
      title,
      difficulty,
      description,
      solutions
    };
  } catch (error) {
    console.error(`Error parsing problem ${dirName}:`, error);
    return null;
  }
}

function getLanguageFromExtension(ext: string): string {
  const extensionMap: Record<string, string> = {
    '.py': 'python',
    '.js': 'javascript',
    '.ts': 'typescript',
    '.java': 'java',
    '.cpp': 'cpp',
    '.c': 'c'
  };
  return extensionMap[ext] || 'text';
}
