"use server";

import { prisma } from "@/lib/db";
import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "@/lib/judge0";
import { getCurrentUserData } from "@/modules/auth/actions";

export const getAllProblems = async () => {
  try {
    const problems = await prisma.problem.findMany({
      include: {
        solvedBy: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: problems,
    };
  } catch (error: unknown) {
    console.error("Error fetching problems:", error);

    return {
      success: false,
      error: "Failed to fetch problems",
    };
  }
};

export const getProblemById = async (id: string) => {
  try {
    const problem = await prisma.problem.findUnique({
      where: { id },
    });

    return {
      success: true,
      data: problem,
    };
  } catch (error: unknown) {
    console.error("Error fetching problem:", error);

    return {
      success: false,
      error: "Failed to fetch problem",
    };
  }
};

export const executeCode = async (
  source_code: string,
  language_id: number,
  stdin: string[],
  expected_outputs: string[],
  id: string,
) => {
  try {
    const user = await getCurrentUserData();

    if (!user || "error" in user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length ||
      !stdin.every((input) => typeof input === "string") ||
      !expected_outputs.every((output) => typeof output === "string") ||
      typeof source_code !== "string" ||
      !source_code.trim() ||
      typeof id !== "string" ||
      !id.trim()
    ) {
      return {
        success: false,
        error: "Invalid test cases or submission data",
      };
    }

    const problem = await prisma.problem.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!problem) {
      return {
        success: false,
        error: "Problem not found",
      };
    }

    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
      base64_encoded: false,
      wait: false,
    }));

    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((result) => result.token);
    const results = await pollBatchResults(tokens);

    if (results.length !== stdin.length) {
      return {
        success: false,
        error: "Failed to retrieve all test case results",
      };
    }

    let allPassed = true;

    const detailedResults = results.map((result, index) => {
      const stdout = result.stdout?.trim() ?? null;
      const expectedOutput = expected_outputs[index]?.trim() ?? "";
      const passed =
        result.status.description === "Accepted" &&
        stdout === expectedOutput;

      if (!passed) {
        allPassed = false;
      }

      return {
        testCase: index + 1,
        passed,
        stdout,
        expected: expectedOutput,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: result.status.description,
        memory: result.memory != null ? `${result.memory} KB` : undefined,
        time: result.time != null ? `${result.time} s` : undefined,
      };
    });

    const submission = await prisma.submission.create({
      data: {
        userId: user.id,
        problemId: id,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(
          detailedResults.map((result) => result.stdout),
        ),
        stderr: detailedResults.some((result) => result.stderr)
          ? JSON.stringify(
              detailedResults.map((result) => result.stderr),
            )
          : null,
        compileOutput: detailedResults.some(
          (result) => result.compile_output,
        )
          ? JSON.stringify(
              detailedResults.map((result) => result.compile_output),
            )
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((result) => result.memory)
          ? JSON.stringify(
              detailedResults.map((result) => result.memory ?? null),
            )
          : null,
        time: detailedResults.some((result) => result.time)
          ? JSON.stringify(
              detailedResults.map((result) => result.time ?? null),
            )
          : null,
      },
    });

    if (allPassed) {
      await prisma.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId: user.id,
            problemId: id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          problemId: id,
        },
      });
    }

    const testCaseResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      status: result.status,
      memory: result.memory ?? null,
      time: result.time ?? null,
    }));

    await prisma.testCaseResult.createMany({
      data: testCaseResults,
    });

    const submissionWithTestCases =
      await prisma.submission.findUnique({
        where: { id: submission.id },
        include: {
          testCases: true,
        },
      });

    return {
      success: true,
      submission: submissionWithTestCases,
    };
  } catch (error: unknown) {
    console.error("Error executing code:", error);

    return {
      success: false,
      error: "Failed to execute code",
    };
  }
};

export const getAllSubmissionByCurrentUserForProblem = async (
  problemId: string,
) => {
  try {
    const user = await getCurrentUserData();

    if (!user || "error" in user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const submissions = await prisma.submission.findMany({
      where: {
        problemId,
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: submissions,
    };
  } catch (error: unknown) {
    console.error("Error fetching user submissions:", error);

    return {
      success: false,
      error: "Failed to fetch submissions",
    };
  }
};