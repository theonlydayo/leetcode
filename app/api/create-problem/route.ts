
import { prisma } from "@/lib/db";
import { Difficulty, UserRole } from "@/lib/generated/prisma/enums";
import { Prisma } from "@/lib/generated/prisma/client";
import {
  getJudge0languageId,
  pollBatchResults,
  submitBatch,
} from "@/lib/judge0";
import { currentUserRole, getCurrentUserData } from "@/modules/auth/actions";
import { NextRequest, NextResponse } from "next/server";

type TestCase = {
  input: string;
  output: string;
};

type CreateProblemBody = {
  title: string;
  description: string;
  difficulty: string;
  tags: string[];
  examples: unknown;
  constraints: string;
  testCases: TestCase[];
  codeSnippets: unknown;
  referenceSolutions: Record<string, unknown>;
};

export async function POST(request: NextRequest) {
  try {
    const userRole = await currentUserRole();
    const user = await getCurrentUserData();

    if (!user || "error" in user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 },
      );
    }

    if (userRole !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 },
      );
    }

    const body = (await request.json()) as CreateProblemBody;

    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testCases,
      codeSnippets,
      referenceSolutions,
    } = body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof difficulty !== "string" ||
      !Array.isArray(tags) ||
      !tags.every((tag) => typeof tag === "string") ||
      typeof constraints !== "string" ||
      !codeSnippets ||
      !referenceSolutions ||
      typeof referenceSolutions !== "object" ||
      Array.isArray(referenceSolutions)
    ) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 },
      );
    }

    const validDifficulties = Object.values(Difficulty);

    if (!validDifficulties.includes(difficulty as Difficulty)) {
      return NextResponse.json(
        { error: "Invalid difficulty" },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(testCases) ||
      testCases.length === 0 ||
      !testCases.every(
        (testCase) =>
          testCase &&
          typeof testCase.input === "string" &&
          typeof testCase.output === "string" &&
          testCase.input.trim() !== "" &&
          testCase.output.trim() !== "",
      )
    ) {
      return NextResponse.json(
        { error: "At least one valid test case is required" },
        { status: 400 },
      );
    }

    for (const [language, solutionCode] of Object.entries(
      referenceSolutions,
    )) {
      if (
        typeof solutionCode !== "string" ||
        !solutionCode.trim()
      ) {
        return NextResponse.json(
          { error: `Invalid reference solution for ${language}` },
          { status: 400 },
        );
      }

      const languageId = getJudge0languageId(language);

      if (typeof languageId !== "number") {
        return NextResponse.json(
          { error: `Unsupported language: ${language}` },
          { status: 400 },
        );
      }

      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((result) => result.token);

      if (tokens.some((token) => !token)) {
        return NextResponse.json(
          {
            error: `Judge0 did not return all submission tokens for ${language}`,
          },
          { status: 502 },
        );
      }

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (!result || result.status.id !== 3) {
          return NextResponse.json(
            {
              error: `Validation failed for ${language}`,
              testCase: {
                input: submissions[i]?.stdin,
                expectedOutput: submissions[i]?.expected_output,
                actualOutput: result?.stdout,
                error: result?.stderr || result?.compile_output,
              },
              details: result,
            },
            { status: 400 },
          );
        }
      }
    }

    const newProblem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty: difficulty as Difficulty,
        tags,
        examples: examples as Prisma.InputJsonValue,
        constraints,
        testCases: testCases as unknown as Prisma.InputJsonValue,
        codeSnippets: codeSnippets as Prisma.InputJsonValue,
        referenceSolutions:
          referenceSolutions as Prisma.InputJsonValue,
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Problem Created Successfully",
        data: newProblem,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Create problem error:", error);

    return NextResponse.json(
      { error: "Failed to create problem" },
      { status: 500 },
    );
  }
}
