import { useMemo, useState } from 'react'
import './App.css'

type Section = 'dashboard' | 'teoria' | 'simulatore' | 'ripasso' | 'tutoring'

type QuizQuestion = {
  id: string
  topic: string
  prompt: string
  options: string[]
  correctIndex: number
  strategy: string
}

const quizBank: QuizQuestion[] = [
  {
    id: 'log-1',
    topic: 'Logaritmi',
    prompt: 'Quanto vale log₂(32)?',
    options: ['4', '5', '6', '8'],
    correctIndex: 1,
    strategy:
      'Strategia rapida: riconosci subito 32 come potenza di 2 (2⁵). Il logaritmo base 2 restituisce l’esponente: 5.',
  },
  {
    id: 'lim-1',
    topic: 'Limiti',
    prompt: 'Lim x→0 di (sin x)/x è:',
    options: ['0', '1', '∞', 'Non esiste'],
    correctIndex: 1,
    strategy:
      'Strategia rapida: usa il limite notevole fondamentale. In prossimità di 0, sin x si comporta come x, quindi il rapporto tende a 1.',
  },
  {
    id: 'prob-1',
    topic: 'Probabilità',
    prompt: 'Lanciando una moneta equa due volte, la probabilità di ottenere due teste è:',
    options: ['1/2', '1/3', '1/4', '2/3'],
    correctIndex: 2,
    strategy:
      'Strategia rapida: eventi indipendenti → moltiplica le probabilità. (1/2)·(1/2)=1/4.',
  },
]

const navItems: Array<{ key: Section; label: string }> = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'teoria', label: 'Archivio Teoria' },
  { key: 'simulatore', label: 'Simulatore' },
  { key: 'ripasso', label: 'Ripasso Mirato' },
  { key: 'tutoring', label: 'Tutoring' },
]

function App() {
  const [activeSection, setActiveSection] = useState<Section>('dashboard')
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [totalAnswers, setTotalAnswers] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [mistakeIds, setMistakeIds] = useState<string[]>([])
  const [isExamRunning, setIsExamRunning] = useState(false)
  const [bookedSlot, setBookedSlot] = useState<string | null>(null)

  const currentQuestion = quizBank[activeQuestionIndex]

  const studyProgress = useMemo(() => {
    const completion = Math.min((totalAnswers / 12) * 100, 100)
    return Math.round(completion)
  }, [totalAnswers])

  const dailyQuiz = quizBank[(new Date().getDate() - 1) % quizBank.length]

  const reviewItems = useMemo(
    () => quizBank.filter((quiz) => mistakeIds.includes(quiz.id)),
    [mistakeIds],
  )

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isSubmitted) return

    const isCorrect = selectedAnswer === currentQuestion.correctIndex
    setIsSubmitted(true)
    setTotalAnswers((prev) => prev + 1)

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1)
      setMistakeIds((prev) => prev.filter((id) => id !== currentQuestion.id))
      return
    }

    setMistakeIds((prev) => (prev.includes(currentQuestion.id) ? prev : [...prev, currentQuestion.id]))
  }

  const handleNextQuestion = () => {
    setActiveQuestionIndex((prev) => (prev + 1) % quizBank.length)
    setSelectedAnswer(null)
    setIsSubmitted(false)
  }

  const startReviewQuestion = (id: string) => {
    const nextIndex = quizBank.findIndex((quiz) => quiz.id === id)
    if (nextIndex === -1) return

    setActiveSection('simulatore')
    setActiveQuestionIndex(nextIndex)
    setSelectedAnswer(null)
    setIsSubmitted(false)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>Semestre Filtro Trainer</h1>
        <p>Allenamento rapido, feedback immediato, ripasso intelligente.</p>
      </header>

      <nav className="bottom-nav" aria-label="Aree applicazione">
        {navItems.map((item) => (
          <button
            key={item.key}
            type="button"
            className={item.key === activeSection ? 'active' : ''}
            onClick={() => setActiveSection(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main className="content">
        {activeSection === 'dashboard' && (
          <section className="panel">
            <h2>Dashboard</h2>
            <div className="kpi-card">
              <div className="kpi-header">
                <strong>Progresso studio</strong>
                <span>{studyProgress}%</span>
              </div>
              <div className="progress-track" role="progressbar" aria-valuenow={studyProgress}>
                <div className="progress-fill" style={{ width: `${studyProgress}%` }}></div>
              </div>
              <small>{totalAnswers} quiz completati oggi</small>
            </div>

            <div className="kpi-card">
              <strong>Quiz del giorno · {dailyQuiz.topic}</strong>
              <p>{dailyQuiz.prompt}</p>
              <button type="button" onClick={() => startReviewQuestion(dailyQuiz.id)}>
                Inizia ora
              </button>
            </div>

            <div className="grid-two">
              <div className="kpi-card">
                <strong>Precisione</strong>
                <p>{totalAnswers === 0 ? '0' : Math.round((correctAnswers / totalAnswers) * 100)}%</p>
              </div>
              <div className="kpi-card">
                <strong>Errori in ripasso</strong>
                <p>{reviewItems.length}</p>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'teoria' && (
          <section className="panel">
            <h2>Archivio Teoria</h2>
            <p className="muted">Consultazione protetta in-app: stampa/copia disabilitate lato interfaccia.</p>
            <div className="list">
              <article className="item-card">
                <strong>Analisi I - Limiti e derivate</strong>
                <p>Dispensa protetta · Lettura online</p>
                <button type="button">Apri lettore</button>
              </article>
              <article className="item-card">
                <strong>Algebra lineare - Matrici</strong>
                <p>Dispensa protetta · Accesso autenticato</p>
                <button type="button">Apri lettore</button>
              </article>
            </div>
          </section>
        )}

        {activeSection === 'simulatore' && (
          <section className="panel">
            <h2>Simulatore</h2>
            <div className="kpi-card">
              <div className="kpi-header">
                <strong>Modalità esame</strong>
                <span>{isExamRunning ? '30:00' : 'Pronto'}</span>
              </div>
              <button type="button" onClick={() => setIsExamRunning((prev) => !prev)}>
                {isExamRunning ? 'Termina simulazione' : 'Avvia simulazione a tempo'}
              </button>
            </div>

            <article className="quiz-card">
              <small>{currentQuestion.topic}</small>
              <h3>{currentQuestion.prompt}</h3>
              <div className="list">
                {currentQuestion.options.map((option, index) => {
                  const isCorrect = index === currentQuestion.correctIndex
                  const isSelected = index === selectedAnswer
                  const className = isSubmitted
                    ? isCorrect
                      ? 'answer ok'
                      : isSelected
                        ? 'answer ko'
                        : 'answer'
                    : 'answer'

                  return (
                    <button
                      key={option}
                      type="button"
                      className={className}
                      onClick={() => setSelectedAnswer(index)}
                      disabled={isSubmitted}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>

              {!isSubmitted ? (
                <button type="button" onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
                  Conferma risposta
                </button>
              ) : (
                <div className="strategy-box" role="status" aria-live="polite">
                  <strong>Strategia di Risoluzione Rapida</strong>
                  <p>{currentQuestion.strategy}</p>
                  <button type="button" onClick={handleNextQuestion}>
                    Prossimo quiz
                  </button>
                </div>
              )}
            </article>
          </section>
        )}

        {activeSection === 'ripasso' && (
          <section className="panel">
            <h2>Ripasso Mirato</h2>
            {reviewItems.length === 0 ? (
              <p className="muted">Nessun errore da ripassare. Continua con il simulatore.</p>
            ) : (
              <div className="list">
                {reviewItems.map((quiz) => (
                  <article key={quiz.id} className="item-card">
                    <strong>{quiz.topic}</strong>
                    <p>{quiz.prompt}</p>
                    <button type="button" onClick={() => startReviewQuestion(quiz.id)}>
                      Rifai quiz
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeSection === 'tutoring' && (
          <section className="panel">
            <h2>Tutoring (Upsell)</h2>
            <p className="muted">Prenota in autonomia una sessione privata da 60 minuti.</p>
            <div className="list">
              {['Lun 17:30', 'Mer 19:00', 'Sab 10:00'].map((slot) => (
                <article key={slot} className="item-card">
                  <strong>{slot}</strong>
                  <p>1 posto disponibile · €45</p>
                  <button type="button" onClick={() => setBookedSlot(slot)}>
                    {bookedSlot === slot ? 'Prenotato' : 'Prenota e paga'}
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
