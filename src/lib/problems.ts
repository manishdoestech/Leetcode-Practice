'use server';

import fs from 'fs';
import path from 'path';
import problemsData from '@/data/problems.json';

export interface Problem {
  id: string;
  title: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  description: string;
  solutions: Solution[];
  topics: string[];
}

export interface Solution {
  language: string;
  code: string;
  filename: string;
}

function normalizeDifficulty(difficulty: unknown): 'Easy' | 'Medium' | 'Hard' | undefined {
  if (difficulty === 'Easy' || difficulty === 'Medium' || difficulty === 'Hard') return difficulty;
  return undefined;
}

function isSolution(obj: unknown): obj is Solution {
  return (
    typeof obj === 'object' && obj !== null &&
    'language' in obj && typeof (obj as Record<string, unknown>).language === 'string' &&
    'code' in obj && typeof (obj as Record<string, unknown>).code === 'string' &&
    'filename' in obj && typeof (obj as Record<string, unknown>).filename === 'string'
  );
}

function isProblem(obj: unknown): obj is Problem {
  return (
    typeof obj === 'object' && obj !== null &&
    'id' in obj && typeof (obj as Record<string, unknown>).id === 'string' &&
    'title' in obj && typeof (obj as Record<string, unknown>).title === 'string' &&
    'description' in obj && typeof (obj as Record<string, unknown>).description === 'string' &&
    'solutions' in obj && Array.isArray((obj as Record<string, unknown>).solutions) &&
    ((obj as Record<string, unknown>).solutions as unknown[]).every(isSolution)
  );
}

function normalizeProblem(raw: unknown): Problem {
  if (!isProblem(raw)) {
    throw new Error('Invalid problem data');
  }
  return {
    ...raw,
    difficulty: normalizeDifficulty((raw as { difficulty?: unknown }).difficulty),
  };
}

function parseReadmeTopics(): Record<string, string[]> {
  const readmePath = path.resolve(process.cwd(), 'README.md');
  if (!fs.existsSync(readmePath)) return {};
  const readme = fs.readFileSync(readmePath, 'utf-8');
  const match = /<!---LeetCode Topics Start-->([\s\S]*?)<!---LeetCode Topics End-->/.exec(readme);
  if (!match) return {};
  const section = match[1];
  const lines = section.split(/\r?\n/);
  const topicsMap: Record<string, string[]> = {};
  let currentTopic = '';
  for (const line of lines) {
    const topicMatch = /^##\s*(.*)/.exec(line);
    if (topicMatch) {
      currentTopic = topicMatch[1].trim();
      topicsMap[currentTopic] = [];
    } else if (currentTopic) {
      const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(line);
      if (linkMatch) {
        const idWithTitle = linkMatch[1].trim();
        // Use full id (including slug) to match problems
        topicsMap[currentTopic].push(idWithTitle);
      }
    }
  }
  return topicsMap;
}

export async function getAllProblems(): Promise<Problem[]> {
  const topicsMap = parseReadmeTopics();
  return (problemsData as unknown[]).map((raw) => {
    const problem = normalizeProblem(raw);
    const topics = Object.entries(topicsMap)
      .filter(([, ids]) => ids.includes(problem.id))
      .map(([topic]) => topic);
    return { ...problem, topics };
  });
}

export async function getProblemById(id: string): Promise<Problem | null> {
  const raw = (problemsData as unknown[]).find((p) => isProblem(p) && p.id === id);
  if (!raw) return null;
  const problem = normalizeProblem(raw);
  const topicsMap = parseReadmeTopics();
  const topics = Object.entries(topicsMap)
    .filter(([, ids]) => ids.includes(problem.id))
    .map(([topic]) => topic);
  return { ...problem, topics };
}
