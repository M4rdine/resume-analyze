"use client"

import type React from "react"

import { useState } from "react"
import { Loader2, Upload, FileText, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

export function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<{
    summary: string
    skills: string
    match: string
    score: number
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const analyzeResume = async () => {
    if (!file || !jobDescription) return

    setIsAnalyzing(true)

    try {
      // Ler o conteúdo do arquivo
      const fileText = await readFileAsText(file)

      // Chamar nossa rota de API ao invés de usar o SDK de IA diretamente
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText: fileText,
          jobDescription,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao analisar currículo")
      }

      const results = await response.json()
      setResults(results)
    } catch (error) {
      console.error("Erro ao analisar currículo:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const readFileAsText = async (file: File) => {
   const formData = new FormData();
    formData.append("FILE", file);

    try {
      const response = await fetch("/api/parse-data", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const parsedText = await response.text();
      console.log(parsedText);
      return parsedText;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Enviar Currículo e Descrição da Vaga</CardTitle>
          <CardDescription>
            Envie o currículo do candidato e insira a descrição da vaga para analisar a compatibilidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="resume">Currículo</Label>
            <div
              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => document.getElementById("resume-upload")?.click()}
            >
              {file ? (
                <>
                  <FileText className="h-8 w-8 text-primary" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                    }}
                  >
                    Trocar arquivo
                  </Button>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="font-medium">Clique para enviar currículo</p>
                  <p className="text-sm text-muted-foreground">PDF, DOCX ou TXT (máx 5MB)</p>
                </>
              )}
              <input
                id="resume-upload"
                type="file"
                className="hidden"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-description">Descrição da Vaga</Label>
            <Textarea
              id="job-description"
              placeholder="Cole a descrição da vaga aqui..."
              className="min-h-[150px]"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={analyzeResume} disabled={!file || !jobDescription || isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analisando Currículo...
              </>
            ) : (
              "Analisar Currículo"
            )}
          </Button>
        </CardFooter>
      </Card>

      {isAnalyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Analisando currículo...</span>
                <span className="text-sm text-muted-foreground">Por favor aguarde</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Resultados da Análise</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Pontuação de Compatibilidade:</span>
                <span
                  className={`text-lg font-bold ${
                    results.score >= 80 ? "text-green-500" : results.score >= 60 ? "text-amber-500" : "text-red-500"
                  }`}
                >
                  {results.score}%
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Resumo do Currículo</TabsTrigger>
                <TabsTrigger value="skills">Principais Habilidades</TabsTrigger>
                <TabsTrigger value="match">Compatibilidade com a Vaga</TabsTrigger>
              </TabsList>
              <TabsContent value="summary" className="mt-4 space-y-4">
                <div className="prose max-w-none">
                  <p>{results.summary}</p>
                </div>
              </TabsContent>
              <TabsContent value="skills" className="mt-4 space-y-4">
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: results.skills }} />
              </TabsContent>
              <TabsContent value="match" className="mt-4 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        results.score >= 80
                          ? "bg-green-100 text-green-700"
                          : results.score >= 60
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      <span className="text-xl font-bold">{results.score}%</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Compatibilidade Geral</h3>
                      <p className="text-sm text-muted-foreground">
                        {results.score >= 80 ? "Alta compatibilidade" : results.score >= 60 ? "Compatibilidade média" : "Baixa compatibilidade"}
                      </p>
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    <p>{results.match}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setFile(null)
                setJobDescription("")
                setResults(null)
              }}
            >
              Iniciar Nova Análise
            </Button>
            <Button>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Salvar em Candidatos
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
