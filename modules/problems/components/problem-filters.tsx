"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIFFICULTIES } from "../constant";

type ProblemsFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  difficulty: string;
  onDifficultyChange: (value: string) => void;
  selectedTag: string;
  onTagChange: (value: string) => void;
  allTags?: string[];
};

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
};

type TagSelectProps = SelectProps & {
  tags: string[];
};

/**
 * Filters section with search, difficulty, and tag dropdowns.
 */
export function ProblemsFilters({
  search,
  onSearchChange,
  difficulty,
  onDifficultyChange,
  selectedTag,
  onTagChange,
  allTags = [],
}: ProblemsFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h3 className="text-lg font-medium">Filters</h3>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <SearchInput value={search} onChange={onSearchChange} />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <DifficultySelect
              value={difficulty}
              onChange={onDifficultyChange}
            />

            <TagSelect
              value={selectedTag}
              onChange={onTagChange}
              tags={allTags}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Search input with icon.
 */
function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />

      <Input
        placeholder="Search by title..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="pl-10"
      />
    </div>
  );
}

/**
 * Difficulty filter dropdown.
 */
function DifficultySelect({ value, onChange }: SelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-45">
        <SelectValue placeholder="Select difficulty" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="ALL">All Difficulties</SelectItem>

        {DIFFICULTIES.map((diff) => (
          <SelectItem key={diff} value={diff}>
            {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/**
 * Tag filter dropdown.
 */
function TagSelect({ value, onChange, tags }: TagSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-45">
        <SelectValue placeholder="Select tag" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="ALL">All Tags</SelectItem>

        {tags.map((tag) => (
          <SelectItem key={tag} value={tag}>
            {tag}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}