'use server';

import problemsData from '@/data/problems.json';

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

export async function getAllProblems(): Promise<Problem[]> {
  return (problemsData as unknown[]).map(normalizeProblem);
}

export async function getProblemById(id: string): Promise<Problem | null> {
  const found = (problemsData as unknown[]).find((p) => isProblem(p) && p.id === id);
  return found ? normalizeProblem(found) : null;
}
