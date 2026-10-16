import axios from "axios";

export type Judge0Result = {
  token?: string;
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: {
    id: number;
    description: string;
  };
  memory: number | null;
  time: string | null;
};

type Judge0Submission = {
  source_code: string;
  language_id: number;
  stdin: string;
  base64_encoded?: boolean;
  wait?: boolean;
};

type Judge0Token = {
  token: string;
};

type Judge0BatchResponse = {
  submissions: Judge0Result[];
};

const JUDGE0_URL =
  "https://judge0-extra-ce1.p.rapidapi.com";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "judge0-extra-ce1.p.rapidapi.com";

function getHeaders() {
  if (!RAPIDAPI_KEY) {
    throw new Error("RAPIDAPI_KEY environment variable is not configured");
  }

  return {
    "x-rapidapi-key": RAPIDAPI_KEY,
    "x-rapidapi-host": RAPIDAPI_HOST,
    "Content-Type": "application/json",
  };
}

export function getJudge0languageId(
  language: string,
): number | undefined {
  const languageMap: Record<string, number> = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
  };

  return languageMap[language.toUpperCase()];
}

export function getLanguageName(languageId: number): string {
  const languageNames: Record<number, string> = {
    74: "TypeScript",
    63: "JavaScript",
    71: "Python",
    62: "Java",
  };

  return languageNames[languageId] ?? "Unknown";
}

export async function submitBatch(
  submissions: Judge0Submission[],
): Promise<Judge0Token[]> {
  const { data } = await axios.post<Judge0Token[]>(
    `${JUDGE0_URL}/submissions/batch`,
    { submissions },
    {
      params: {
        base64_encoded: "false",
      },
      headers: getHeaders(),
    },
  );

  return data;
}

export async function pollBatchResults(
  tokens: string[],
): Promise<Judge0Result[]> {
  if (tokens.length === 0) {
    return [];
  }

  const maxAttempts = 60;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const { data } = await axios.get<Judge0BatchResponse>(
      `${JUDGE0_URL}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: "false",
          fields: "*",
        },
        headers: getHeaders(),
      },
    );

    const results = data.submissions;

    const isAllDone = results.every(
      (result: Judge0Result) =>
        result.status.id !== 1 && result.status.id !== 2,
    );

    if (isAllDone) {
      return results;
    }

    await sleep(1000);
  }

  throw new Error("Judge0 execution timed out");
}

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));