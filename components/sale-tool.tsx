"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Upload, FileJson, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Configurator } from "@/components/configurator/configurator";
import { parseConfJson, type ParseResult } from "@/app/actions";
import type { ConfiguratorType } from "@/lib/schemas";

/**
 * Dvě obrazovky nástroje:
 *
 *  1. nahrání `data.json`, které přišlo přílohou v e-mailu z konfigurátoru,
 *  2. ten samý konfigurátor jako na webu, předvyplněný hodnotami ze souboru —
 *     obchodník v něm může cokoli přepsat, zadat v posledním kroku slevu
 *     a odeslat přepočítanou nabídku.
 */
export function SaleTool() {
  const [data, setData] = useState<ConfiguratorType | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    setErrors(null);
    setIsParsing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res: ParseResult = await parseConfJson(formData);
      if (res.success) {
        setData(res.data);
      } else {
        setErrors(res.validationErrors ?? null);
        toast.error(res.error);
      }
    } catch {
      toast.error("Soubor se nepodařilo načíst");
    } finally {
      setIsParsing(false);
    }
  };

  if (data) {
    return (
      <>
        <Toaster position="top-center" />
        <Configurator
          defaultValues={data}
          heading="Nabídka se slevou"
          subheading={`Načteno z ${fileName ?? "data.json"}. Zkontrolujte hodnoty, v posledním kroku zadejte slevu a nabídku odešlete.`}
          onReset={() => {
            setData(null);
            setFileName(null);
            setErrors(null);
          }}
        />
      </>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Toaster position="top-center" />
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Nabídka se slevou</CardTitle>
          <CardDescription>
            Nahrajte <code>data.json</code> z e-mailu konfigurátoru. Otevře se konfigurátor
            s hodnotami zákazníka, kde nabídku upravíte a doplníte slevu.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            {/* `accept` musí pustit i `application/octet-stream` (na iOS UTI `public.data`):
                poštovní klienti na telefonu ukládají přílohu `data.json` bez správného
                MIME typu a picker ji pak nabídne šedou, takže obchodník soubor vůbec
                nevybere. Obsah se stejně validuje na serveru v `parseConfJson`.
                `sr-only` místo `hidden` — file input schovaný přes `display:none`
                na některých mobilních Safari nereaguje na kliknutí do labelu. */}
            <input
              id="file"
              name="file"
              type="file"
              accept=".json,application/json,text/plain,application/octet-stream"
              className="sr-only"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <label
              htmlFor="file"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-primary/50"
            >
              {isParsing ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-sm font-medium">Načítám…</span>
                </>
              ) : fileName ? (
                <>
                  <FileJson className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">{fileName}</span>
                </>
              ) : (
                <>
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Klikněte pro nahrání</span>
                </>
              )}
            </label>
          </div>

          {errors ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Soubor neodpovídá schématu</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 list-inside list-disc text-sm">
                  {Object.entries(errors).map(([field, msgs]) => (
                    <li key={field}>
                      <strong>{field}:</strong> {msgs.join(", ")}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          ) : null}

          <p className="text-sm text-muted-foreground">
            Soubor projde stejnou validací jako poptávka z webu — když neprojde, uvidíte tu,
            které pole neodpovídá.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
