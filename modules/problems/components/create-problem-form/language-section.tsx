
"use client";

import { Controller } from "react-hook-form";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import { Code2, CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { LANGUAGES, problemSchema } from "../../schema";
import { CodeEditor } from "./code-editor";

type ProblemFormData = z.infer<typeof problemSchema>;
type Language = keyof ProblemFormData["examples"];

type LanguageSectionsProps = {
  form: UseFormReturn<ProblemFormData>;
};

type LanguageCardProps = {
  language: Language;
  form: UseFormReturn<ProblemFormData>;
};

type EditorProps = {
  language: Language;
  control: Control<ProblemFormData>;
  error:
    | { message?: string }
    | undefined;
};

type ExampleFieldsProps = {
  language: Language;
  register: UseFormRegister<ProblemFormData>;
  errors: FieldErrors<ProblemFormData>;
};

type EditorLanguage = "javascript" | "python" | "java";

const EDITOR_LANGUAGE: Record<Language, EditorLanguage> = {
  JAVASCRIPT: "javascript",
  PYTHON: "python",
  JAVA: "java",
};

export function LanguageSections({ form }: LanguageSectionsProps) {
  return (
    <>
      {(LANGUAGES as readonly Language[]).map((language) => (
        <LanguageCard
          key={language}
          language={language}
          form={form}
        />
      ))}
    </>
  );
}

function LanguageCard({ language, form }: LanguageCardProps) {
  const {
    control,
    register,
    formState: { errors },
  } = form;

  return (
    <Card className="bg-slate-50 dark:bg-slate-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Code2 className="h-5 w-5 text-slate-600" />
          {language}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <StarterCodeEditor
          language={language}
          control={control}
          error={errors.codeSnippets?.[language]}
        />

        <ReferenceSolutionEditor
          language={language}
          control={control}
          error={errors.referenceSolutions?.[language]}
        />

        <ExampleFields
          language={language}
          register={register}
          errors={errors}
        />
      </CardContent>
    </Card>
  );
}

function StarterCodeEditor({
  language,
  control,
  error,
}: EditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Starter Code Template
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Controller
          name={`codeSnippets.${language}`}
          control={control}
          render={({ field }) => (
            <CodeEditor
              value={field.value ?? ""}
              onChange={field.onChange}
              language={EDITOR_LANGUAGE[language]}
            />
          )}
        />

        {error?.message && (
          <p className="mt-2 text-sm text-red-500">
            {error.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ReferenceSolutionEditor({
  language,
  control,
  error,
}: EditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          Reference Solution
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Controller
          name={`referenceSolutions.${language}`}
          control={control}
          render={({ field }) => (
            <CodeEditor
              value={field.value ?? ""}
              onChange={field.onChange}
              language={EDITOR_LANGUAGE[language]}
            />
          )}
        />

        {error?.message && (
          <p className="mt-2 text-sm text-red-500">
            {error.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ExampleFields({
  language,
  register,
  errors,
}: ExampleFieldsProps) {
  const exampleErrors = errors.examples?.[language];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Example</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label className="font-medium">Input</Label>

            <Textarea
              {...register(`examples.${language}.input`)}
              placeholder="Example input"
              className="mt-2 min-h-20 resize-y font-mono"
            />

            {exampleErrors?.input?.message && (
              <p className="mt-1 text-sm text-red-500">
                {exampleErrors.input.message}
              </p>
            )}
          </div>

          <div>
            <Label className="font-medium">Output</Label>

            <Textarea
              {...register(`examples.${language}.output`)}
              placeholder="Example output"
              className="mt-2 min-h-20 resize-y font-mono"
            />

            {exampleErrors?.output?.message && (
              <p className="mt-1 text-sm text-red-500">
                {exampleErrors.output.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label className="font-medium">Explanation</Label>

            <Textarea
              {...register(`examples.${language}.explanation`)}
              placeholder="Explain the example"
              className="mt-2 min-h-24 resize-y"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
