import { ResumeAnalyzer } from './components/resume-analyzer';

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Ferramenta de Análise de Currículos</h1>
          <p className="text-muted-foreground">
            Envie um currículo e insira a descrição da vaga para obter análise e compatibilidade com IA
          </p>
        </div>
        <ResumeAnalyzer />
      </div>
    </main>
  )
}
