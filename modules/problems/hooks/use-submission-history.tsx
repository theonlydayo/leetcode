
"use client";

import { useEffect, useState } from "react";
import { getAllSubmissionByCurrentUserForProblem } from "../actions";

type Submission = {
  id: string;
  status: string;
  language: string;
  createdAt: Date | string;
  time: string | null;
  memory: string | null;
};

export function useSubmissionHistory(id: string) {
  const [submissionHistory, setSubmissionHistory] = useState<Submission[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchSubmissionHistory = async () => {
      try {
        const response = await getAllSubmissionByCurrentUserForProblem(id);

        if (!cancelled && response.success && Array.isArray(response.data)) {
          setSubmissionHistory(response.data as Submission[]);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          console.error("Error fetching submission history:", error);
        }
      }
    };

    if (id) {
      void fetchSubmissionHistory();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  return {
    submissionHistory,
  };
}
