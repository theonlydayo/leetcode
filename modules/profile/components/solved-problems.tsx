
import React from "react";
import { Trophy, CheckCircle, Calendar } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type SolvedProblem = {
  id: string;
  problemId: string;
  createdAt: Date | string;
};

type SolvedProblemsProps = {
  solvedProblems: SolvedProblem[];
};

const SolvedProblems = ({
  solvedProblems,
}: SolvedProblemsProps) => {
  const formatDate = (dateValue: Date | string): string => {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-green-500" />
          <CardTitle className="text-2xl">
            Solved Problems
          </CardTitle>
          <Badge variant="default">
            {solvedProblems.length}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {solvedProblems.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Trophy className="h-8 w-8 text-muted-foreground" />
            </div>

            <h3 className="mb-2 text-lg font-medium">
              No Problems Solved Yet
            </h3>

            <p className="text-muted-foreground">
              Start solving problems to see your achievements here!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {solvedProblems.map((problem) => (
              <Card
                key={problem.id}
                className="bg-green-50 transition-all duration-200 hover:shadow-md dark:bg-green-950/50"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>

                    <div className="flex-1">
                      <h3 className="mb-2 font-semibold">
                        Problem Solved
                      </h3>

                      <div className="mb-3 text-sm text-muted-foreground">
                        <Badge
                          variant="outline"
                          className="font-mono text-xs"
                        >
                          {problem.problemId.slice(0, 8)}...
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Solved on {formatDate(problem.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SolvedProblems;
