import fs from 'fs';
import path from 'path';

const PROBLEMS_DIR = process.cwd();
const OUTPUT_PATH = path.join(process.cwd(), 'src/data/problems.json');

function getLanguageFromExtension(ext: string): string {
  const extensionMap: Record<string, string> = {
    '.py': 'python',
    '.js': 'javascript',
    '.ts': 'typescript',
    '.java': 'java',
    '.cpp': 'cpp',
    '.c': 'c',
    '.sql': 'sql', // Added support for SQL files
  };
  return extensionMap[ext] || 'text';
}

function parseProblem(dirName: string, problemPath: string) {
  const files = fs.readdirSync(problemPath);
  const readmePath = path.join(problemPath, 'README.md');
  let description = '';
  let title = dirName;
  let difficulty: 'Easy' | 'Medium' | 'Hard' | undefined;

  if (fs.existsSync(readmePath)) {
    const readmeContent = fs.readFileSync(readmePath, 'utf-8');
    description = readmeContent;
    const titleRegex = /<h2><a[^>]*>(\d+\.\s*[^<]+)<\/a><\/h2>/;
    const titleMatch = titleRegex.exec(readmeContent);
    if (titleMatch) title = titleMatch[1];
    const difficultyRegex = /<h3>(Easy|Medium|Hard)<\/h3>/;
    const difficultyMatch = difficultyRegex.exec(readmeContent);
    if (difficultyMatch) difficulty = difficultyMatch[1] as 'Easy' | 'Medium' | 'Hard';
  }

  const solutions = files.filter(f => /\.(py|js|ts|java|cpp|c)$/.test(f)).map(file => {
    const code = fs.readFileSync(path.join(problemPath, file), 'utf-8');
    return {
      language: getLanguageFromExtension(path.extname(file)),
      code,
      filename: file,
    };
  });

  return {
    id: dirName,
    title,
    difficulty,
    description,
    solutions,
  };
}

function main() {
  const entries = fs.readdirSync(PROBLEMS_DIR, { withFileTypes: true });
  const problemDirs = entries.filter(e => e.isDirectory() && /^\d+-.+/.test(e.name));
  const problems = problemDirs.map(dir => parseProblem(dir.name, path.join(PROBLEMS_DIR, dir.name)));
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(problems, null, 2));
  console.log(`Generated ${problems.length} problems to ${OUTPUT_PATH}`);
}

main();
