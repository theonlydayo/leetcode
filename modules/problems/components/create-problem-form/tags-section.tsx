"use client";

import { Plus, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { problemSchema } from "@/modules/problems/schema";

type ProblemFormData = z.infer<typeof problemSchema>;

interface TagsSectionProps {
  form: UseFormReturn<ProblemFormData>;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagsSection({
  form,
  tags,
  onTagsChange,
}: TagsSectionProps) {
  const {
    formState: { errors },
  } = form;

  const addTag = () => {
    onTagsChange([...tags, ""]);
  };

  const updateTag = (index: number, value: string) => {
    onTagsChange(
      tags.map((tag, tagIndex) =>
        tagIndex === index ? value : tag
      )
    );
  };

  const removeTag = (index: number) => {
    if (tags.length <= 1) return;

    onTagsChange(tags.filter((_, tagIndex) => tagIndex !== index));
  };

  return (
    <Card className="bg-amber-50 dark:bg-amber-950/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="h-5 w-5 text-amber-600" />
            Tags
          </CardTitle>

          <Button
            type="button"
            size="sm"
            onClick={addTag}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Tag
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tags.map((tag, index) => (
            <TagItem
              key={index}
              value={tag}
              onChange={(value) => updateTag(index, value)}
              onRemove={() => removeTag(index)}
              canRemove={tags.length > 1}
            />
          ))}
        </div>

        {errors.tags?.message && (
          <p className="mt-2 text-sm text-red-500">
            {errors.tags.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface TagItemProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

function TagItem({
  value,
  onChange,
  onRemove,
  canRemove,
}: TagItemProps) {
  return (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter tag"
        className="flex-1"
      />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        disabled={!canRemove}
        className="p-2"
        aria-label="Remove tag"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
}