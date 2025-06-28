import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProblemById } from "@/lib/problems";
import { MarkdownContent } from "@/components/MarkdownContent";
import { CodeBlock } from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        return "bg-green-100 text-green-800 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        className="container mx-auto px-4 py-8 rounded-2xl shadow-lg"
        style={{
          backgroundColor: "var(--color-card)",
          color: "var(--color-card-foreground)",
        }}
      >
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
              <Card className="h-full rounded-none border-0 bg-card text-card-foreground dark:bg-black dark:text-white">
                <CardHeader>
                  <CardTitle className="text-xl text-card-foreground">
                    Problem Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="!bg-card !text-card-foreground rounded-xl">
                  <MarkdownContent content={problem.description} />
                </CardContent>
              </Card>
            }
            right={
              <Card className="h-full rounded-xl border-0 !bg-card !text-card-foreground shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl text-card-foreground">
                    Solution{problem.solutions.length > 1 ? "s" : ""}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 !bg-card !text-card-foreground rounded-xl">
                  {problem.solutions.map((solution, index) => (
                    <div key={solution.filename}>
                      {index > 0 && <Separator className="my-6" />}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-card-foreground">
                            {solution.filename}
                          </h3>
                          <Badge
                            variant="outline"
                            className="bg-muted text-muted-foreground border-border"
                          >
                            {solution.language}
                          </Badge>
                        </div>
                        <CodeBlock
                          code={solution.code}
                          language={solution.language}
                          filename={solution.filename}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
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
