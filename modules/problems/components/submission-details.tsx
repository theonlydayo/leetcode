import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CpuIcon,
  Code,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type Submission = {
  status: string;
  createdAt: Date | string;
  language: string;
  memory: string | null;
  time: string | null;
};

type SubmissionDetailsProps = {
  submission: Submission;
};

function parseMetricValues(
  value: string | null,
  removeSuffix = false
): number[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item: unknown) => {
        if (typeof item !== "string" && typeof item !== "number") {
          return NaN;
        }

        const normalized = removeSuffix
          ? String(item).replace(/\s*s$/, "")
          : String(item);

        return Number.parseFloat(normalized);
      })
      .filter((number) => Number.isFinite(number));
  } catch {
    return [];
  }
}

function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;

  return values.reduce((total, value) => total + value, 0) / values.length;
}

export const SubmissionDetails = ({
  submission,
}: SubmissionDetailsProps) => {
  const isSuccess = submission.status === "Accepted";

  const averageMemory = calculateAverage(
    parseMetricValues(submission.memory)
  );

  const averageTime = calculateAverage(
    parseMetricValues(submission.time, true)
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Submission Details</CardTitle>

          {isSuccess ? (
            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Success
            </Badge>
          ) : (
            <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
              <XCircle className="mr-1 h-3 w-3" />
              Failed
            </Badge>
          )}
        </div>

        <CardDescription>
          Submitted at{" "}
          {new Date(submission.createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Language</p>
              <p className="text-sm text-muted-foreground">
                {submission.language}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CpuIcon className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Memory (avg)</p>
              <p className="text-sm text-muted-foreground">
                {averageMemory.toFixed(2)} KB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Time (avg)</p>
              <p className="text-sm text-muted-foreground">
                {averageTime.toFixed(3)} s
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};