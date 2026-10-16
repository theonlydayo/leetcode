
"use client";

import { Plus, Trash2, CheckCircle2 } from "lucide-react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { problemSchema } from "../../schema";

type ProblemFormData = z.infer<typeof problemSchema>;

type TestCase = ProblemFormData["testCases"][number];

type TestCasesArray = {
  fields: Array<TestCase & { id: string }>;
  append: (value: TestCase) => void;
  remove: (index?: number | number[]) => void;
};

type TestCasesSectionProps = {
  form: UseFormReturn<ProblemFormData>;
  testCasesArray: TestCasesArray;
};

type TestCaseCardProps = {
  index: number;
  register: UseFormRegister<ProblemFormData>;
  errors: FieldErrors<ProblemFormData>;
  onRemove: () => void;
  canRemove: boolean;
};

export function TestCasesSection({
  form,
  testCasesArray,
}: TestCasesSectionProps) {
  const {
    register,
    formState: { errors },
  } = form;

  const { fields, append, remove } = testCasesArray;

  return (
    <Card className="bg-green-50 dark:bg-green-950/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Test Cases
          </CardTitle>

          <Button
            type="button"
            size="sm"
            onClick={() => append({ input: "", output: "" })}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Test Case
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {fields.map((field, index) => (
          <TestCaseCard
            key={field.id}
            index={index}
            register={register}
            errors={errors}
            onRemove={() => remove(index)}
            canRemove={fields.length > 1}
          />
        ))}

        {errors.testCases &&
          !Array.isArray(errors.testCases) &&
          "message" in errors.testCases &&
          typeof errors.testCases.message === "string" && (
            <p className="text-sm text-red-500">
              {errors.testCases.message}
            </p>
          )}
      </CardContent>
    </Card>
  );
}

function TestCaseCard({
  index,
  register,
  errors,
  onRemove,
  canRemove,
}: TestCaseCardProps) {
  const inputError = errors.testCases?.[index]?.input;
  const outputError = errors.testCases?.[index]?.output;

  return (
    <Card className="bg-background">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            Test Case #{index + 1}
          </CardTitle>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            disabled={!canRemove}
            className="gap-2 text-red-500"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label className="font-medium">Input</Label>

            <Textarea
              {...register(`testCases.${index}.input`)}
              placeholder="Enter test case input"
              className="mt-2 min-h-24 resize-y font-mono"
            />

            {inputError?.message && (
              <p className="mt-1 text-sm text-red-500">
                {inputError.message}
              </p>
            )}
          </div>

          <div>
            <Label className="font-medium">Expected Output</Label>

            <Textarea
              {...register(`testCases.${index}.output`)}
              placeholder="Enter expected output"
              className="mt-2 min-h-24 resize-y font-mono"
            />

            {outputError?.message && (
              <p className="mt-1 text-sm text-red-500">
                {outputError.message}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
