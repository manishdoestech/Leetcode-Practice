import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProblemById } from "@/lib/problems";
import { MarkdownContent } from "@/components/MarkdownContent";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SplitPane } from "@/components/SplitPane";

interface ProblemPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProblemPage({ params }: ProblemPageProps) {
  const { id } = await params;
  const problem = await getProblemById(id);

  if (!problem) {
    notFound();
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700";
      case "Medium":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700";
      case "Hard":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-black">
      {/* Only one main container, no double wrapping */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              className="mb-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Problems
            </Button>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl font-bold text-foreground">
              {problem.title}
            </h1>
            {problem.difficulty && (
              <Badge
                variant="secondary"
                className={`${getDifficultyColor(
                  problem.difficulty
                )} font-medium`}
              >
                {problem.difficulty}
              </Badge>
            )}
          </div>
        </div>

        {/* Draggable Split View */}
        <Card className="rounded-xl overflow-hidden bg-card dark:bg-black text-card-foreground dark:text-white border border-border shadow-md">
          <SplitPane
            left={
              <div className="h-full bg-card dark:bg-black text-card-foreground dark:text-white">
                <div className="p-6 border-b border-border bg-card dark:bg-black">
                  <h2 className="text-xl font-semibold text-card-foreground dark:text-white">
                    Problem Description
                  </h2>
                </div>
                <div className="p-6 problem-content bg-card dark:bg-black">
                  <MarkdownContent content={problem.description} />
                </div>
              </div>
            }
            right={
              <div className="h-full bg-card dark:bg-black text-card-foreground dark:text-white">
                <div className="p-6 border-b border-border bg-card dark:bg-black">
                  <h2 className="text-xl font-semibold text-card-foreground dark:text-white">
                    Solution{problem.solutions.length > 1 ? "s" : ""}
                  </h2>
                </div>
                <div className="p-6 space-y-6 solution-content bg-card dark:bg-black">
                  {problem.solutions.map((solution, index) => (
                    <div key={solution.filename}>
                      {index > 0 && <Separator className="my-6" />}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-card-foreground dark:text-white">
                            {solution.filename}
                          </h3>
                          <Badge
                            variant="outline"
                            className="bg-muted dark:bg-gray-800 text-muted-foreground dark:text-gray-300 border-border dark:border-gray-600"
                          >
                            {solution.language}
                          </Badge>
                        </div>
                        <div className="bg-card dark:bg-black rounded-lg overflow-hidden">
                          <CodeBlock
                            code={solution.code}
                            language={solution.language}
                            filename={solution.filename}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
            minLeft={300}
            minRight={300}
            initial={500}
          />
        </Card>
      </div>
    </div>
  );
}
