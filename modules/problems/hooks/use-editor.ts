
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getJudge0languageId } from "@/lib/judge0";
import { executeCode } from "../actions";

type Language = "JAVASCRIPT" | "PYTHON" | "JAVA";

type EditorProblem = {
  id: string;
  codeSnippets: Partial<Record<Language, string>>;
  testCases: {
    input: string;
    output: string;
  }[];
};

type ExecutionResponse = {
  success: boolean;
  message?: string;
  data?: unknown;
  error?: string;
};

type UseEditorReturn = {
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
  code: string;
  setCode: (code: string) => void;
  isRunning: boolean;
  isSubmitting: boolean;
  executionResponse: ExecutionResponse | null;
  handleRun: () => void;
  handleSubmit: () => Promise<void>;
};

export function useEditor(
  problem: EditorProblem | null | undefined,
  initialLanguage: Language = "JAVASCRIPT",
): UseEditorReturn {
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>(initialLanguage);

  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting] = useState(false);

  const [executionResponse, setExecutionResponse] =
    useState<ExecutionResponse | null>(null);

  useEffect(() => {
    const starterCode = problem?.codeSnippets?.[selectedLanguage];

    if (typeof starterCode === "string") {
      setCode(starterCode);
    }
  }, [selectedLanguage, problem]);

  const handleRun = () => {
    toast.success("This is your assignment");
  };

  const handleSubmit = async (): Promise<void> => {
    if (!problem) {
      toast.error("Problem not found");
      return;
    }

    try {
      setIsRunning(true);

      const languageId = getJudge0languageId(selectedLanguage);

      if (typeof languageId !== "number") {
        toast.error("Unsupported programming language");
        return;
      }

      const stdin = problem.testCases.map((testCase) => testCase.input);
      const expectedOutputs = problem.testCases.map(
        (testCase) => testCase.output,
      );

      const response = await executeCode(
        code,
        languageId,
        stdin,
        expectedOutputs,
        problem.id,
      );

      setExecutionResponse(response as ExecutionResponse);

      if (response.success) {
        toast.success("Code executed successfully");
      } else {
        toast.error(
          "error" in response && typeof response.error === "string"
            ? response.error
            : "Code execution failed",
        );
      }
    } catch (error: unknown) {
      console.error("Error executing code:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Error executing code",
      );
    } finally {
      setIsRunning(false);
    }
  };

  return {
    selectedLanguage,
    setSelectedLanguage,
    code,
    setCode,
    isRunning,
    isSubmitting,
    executionResponse,
    handleRun,
    handleSubmit,
  };
}
