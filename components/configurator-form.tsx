"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { submitConfiguratorData, type SubmitResult } from "@/app/actions";
import { Upload, FileJson, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ConfiguratorForm() {
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file?.name ?? null);
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setResult(null);
    
    try {
      const response = await submitConfiguratorData(formData);
      setResult(response);
      
      if (response.success) {
        formRef.current?.reset();
        setFileName(null);
      }
    } catch {
      setResult({
        success: false,
        error: "Failed to submit form",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Configurator Data Upload</CardTitle>
        <CardDescription>
          Zadejte soubor data.json z mailu a slevu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="file" className="text-sm font-medium">
              JSON soubor
            </label>
            <div className="relative">
              <Input
                id="file"
                name="file"
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file"
                className="flex items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-colors"
              >
                {fileName ? (
                  <>
                    <FileJson className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">{fileName}</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Klikněte pro upload
                    </span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="sale" className="text-sm font-medium">
              Sleva (%)
            </label>
            <Input
              id="sale"
              name="sale"
              type="number"
              placeholder="Zadejte slevu"
              required
              min={0}
              max={100}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Zpracovávám
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>

        {result && (
          <div className="mt-6">
            {result.success ? (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-600">Success!</AlertTitle>
                <AlertDescription className="text-green-600/80">
                  Data uploaded successfully. Sleva {result.sale}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {result.error}
                  {result.validationErrors && (
                    <ul className="mt-2 list-disc list-inside text-sm">
                      {Object.entries(result.validationErrors).map(([field, errors]) => (
                        <li key={field}>
                          <strong>{field}:</strong> {errors.join(", ")}
                        </li>
                      ))}
                    </ul>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {result?.success && result.data && (
          <div className="mt-4">
            <details className="group">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                Data
              </summary>
              <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-64">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
