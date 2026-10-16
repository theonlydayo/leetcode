"use client";

import Link from "next/link";
import { Bookmark, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { getDifficultyColor } from "../constant";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

type Problem = {
  id: string;
  title: string;
  tags: string[];
  difficulty: Difficulty;
  solvedBy?: { userId?: string }[];
};

type ProblemRowProps = {
  problem: Problem;
  user?: {
    role?: string | null;
  } | null;
  onDelete: (problemId: string) => void;
  onSave: (problemId: string) => void;
};

type SolvedCheckboxProps = {
  checked: boolean;
};

type ProblemTitleProps = {
  id: string;
  title: string;
};

type TagsListProps = {
  tags?: string[];
};

type DifficultyBadgeProps = {
  difficulty: Difficulty;
};

type ActionButtonsProps = {
  problemId: string;
  isAdmin: boolean;
  onDelete: (problemId: string) => void;
  onSave: (problemId: string) => void;
};

/**
 * Single row in the problems table.
 */
export function ProblemRow({
  problem,
  user,
  onDelete,
  onSave,
}: ProblemRowProps) {
  const isSolved = (problem.solvedBy?.length ?? 0) > 0;

  return (
    <TableRow>
      <TableCell>
        <SolvedCheckbox checked={isSolved} />
      </TableCell>

      <TableCell className="font-medium">
        <ProblemTitle id={problem.id} title={problem.title} />
      </TableCell>

      <TableCell>
        <TagsList tags={problem.tags} />
      </TableCell>

      <TableCell>
        <DifficultyBadge difficulty={problem.difficulty} />
      </TableCell>

      <TableCell>
        <ActionButtons
          problemId={problem.id}
          isAdmin={user?.role === "ADMIN"}
          onDelete={onDelete}
          onSave={onSave}
        />
      </TableCell>
    </TableRow>
  );
}

function SolvedCheckbox({ checked }: SolvedCheckboxProps) {
  return (
    <Checkbox
      checked={checked}
      disabled
      className="data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600"
    />
  );
}

function ProblemTitle({ id, title }: ProblemTitleProps) {
  return (
    <Link
      href={`/problem/${id}`}
      className="text-primary transition-colors hover:underline"
    >
      {title}
    </Link>
  );
}

function TagsList({ tags = [] }: TagsListProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="outline"
          className="border-orange-200 bg-orange-50 text-xs text-orange-700 hover:bg-orange-50"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}

function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <Badge className={`${getDifficultyColor(difficulty)} border-0 font-medium`}>
      {difficulty}
    </Badge>
  );
}

function ActionButtons({
  problemId,
  isAdmin,
  onDelete,
  onSave,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      {isAdmin && (
        <>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(problemId)}
            aria-label="Delete problem"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled
            aria-label="Edit problem"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onSave(problemId)}
        className="gap-2"
      >
        <Bookmark className="h-4 w-4" />
        <span className="hidden sm:inline">Save</span>
      </Button>
    </div>
  );
}