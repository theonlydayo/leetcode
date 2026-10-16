"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormHeader } from "./form-header";
import { useCreateProblem } from "@/hooks/use-create-problem";
import { BasicInfoSection } from "./basic-info-section";
import { TagsSection } from "./tags-section";
import { TestCasesSection } from "./test-cases-section";
import { LanguageSections } from "./language-section";
import { AdditionalInfoSection } from "./additional-info-section";

type SubmitButtonProps = {
    isLoading: boolean;
};

export function CreateProblemForm() {
    const {
        form,
        testCasesArray,
        tags,
        replaceTags,
        isLoading,
        sampleType,
        setSampleType,
        onSubmit,
        loadSampleData,
    } = useCreateProblem();
    return (
        <div className="container mx-auto max-w-7xl px-4 py-8">
            <Card className="shadow-xl">
                <FormHeader
                    sampleType={sampleType}
                    setSampleType={setSampleType}
                    onLoadSample={loadSampleData}
                />

                <CardContent className="p-6">
                    <form onSubmit={onSubmit} className="space-y-8">
                        <BasicInfoSection form={form} />

                        <TagsSection
                            form={form}
                            tags={tags}
                            onTagsChange={replaceTags}
                        />
                        <TestCasesSection
                            form={form}
                            testCasesArray={testCasesArray}
                        />

                        <LanguageSections form={form} />

                        <AdditionalInfoSection form={form} />

                        <SubmitButton isLoading={isLoading} />
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

function SubmitButton({ isLoading }: SubmitButtonProps) {
    return (
        <div className="mt-6 flex justify-end">
            <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="gap-2"
            >
                {isLoading ? (
                    <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Creating...
                    </>
                ) : (
                    <>
                        <Plus className="h-5 w-5" />
                        Create Problem
                    </>
                )}
            </Button>
        </div>
    );
}
