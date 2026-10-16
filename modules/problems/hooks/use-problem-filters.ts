import { useState, useMemo } from "react";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

type Problem = {
  id: string;
  title: string;
  tags: string[];
  difficulty: Difficulty;
  solvedBy?: { userId?: string }[];
};

export function useProblemFilters(problems: Problem[] = []) {
  const [search, setSearch] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("ALL");
  const [selectedTag, setSelectedTag] = useState<string>("ALL");

  const allTags = useMemo<string[]>(() => {
    const tagsSet = new Set<string>();

    problems.forEach((problem) => {
      problem.tags?.forEach((tag) => tagsSet.add(tag));
    });

    return Array.from(tagsSet);
  }, [problems]);

  const filteredProblems = useMemo(() => {
    return problems
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter(
        (problem) =>
          difficulty === "ALL" || problem.difficulty === difficulty
      )
      .filter(
        (problem) =>
          selectedTag === "ALL" || problem.tags?.includes(selectedTag)
      );
  }, [problems, search, difficulty, selectedTag]);

  return {
    search,
    difficulty,
    selectedTag,
    allTags,
    setSearch,
    setDifficulty,
    setSelectedTag,
    filteredProblems,
  };
}