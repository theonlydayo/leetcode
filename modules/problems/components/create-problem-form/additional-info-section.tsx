
"use client";

import { Lightbulb } from "lucide-react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";

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

type AdditionalInfoSectionProps = {
  form: UseFormReturn<ProblemFormData>;
};

type FieldProps = {
  register: UseFormRegister<ProblemFormData>;
};

type ConstraintsFieldProps = FieldProps & {
  error?: FieldErrors<ProblemFormData>["constraints"];
};

export function AdditionalInfoSection({
  form,
}: AdditionalInfoSectionProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Card className="bg-amber-50 dark:bg-amber-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Lightbulb className="h-5 w-5 text-amber-600" />
          Additional Information
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <ConstraintsField
          register={register}
          error={errors.constraints}
        />

        <HintsField register={register} />
        <EditorialField register={register} />
      </CardContent>
    </Card>
  );
}

function ConstraintsField({
  register,
  error,
}: ConstraintsFieldProps) {
  return (
    <div>
      <Label className="font-medium">Constraints</Label>

      <Textarea
        {...register("constraints")}
        placeholder="Enter problem constraints"
        className="mt-2 min-h-24 resize-y font-mono"
      />

      {error?.message && (
        <p className="mt-1 text-sm text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
}

function HintsField({ register }: FieldProps) {
  return (
    <div>
      <Label className="font-medium">Hints (Optional)</Label>

      <Textarea
        {...register("hints")}
        placeholder="Enter hints for solving the problem"
        className="mt-2 min-h-24 resize-y"
      />
    </div>
  );
}

function EditorialField({ register }: FieldProps) {
  return (
    <div>
      <Label className="font-medium">Editorial (Optional)</Label>

      <Textarea
        {...register("editorial")}
        placeholder="Enter problem editorial/solution explanation"
        className="mt-2 min-h-32 resize-y"
      />
    </div>
  );
}
