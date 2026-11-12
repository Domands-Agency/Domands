'use client'

import Link from 'next/link'
import React, { useCallback, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { EnquiryButton } from './Enquiry'
import { LeadForm } from './LeadForm'

export type QuizData = {
  h1: string
  line: string
  reassurance: string
  startLabel: string
  gateHeading: string
  gateLine: string
  gateConsent: string
  gateButton: string
  resultFooter: string
  waHref: string
  waMessage: string
  callHref: string
  questions: { question: string; kind: 'scored' | 'industry' | 'goal'; area?: string | null; answers: { label: string; value?: string | null }[] }[]
  bands: { name: string; min: number; max: number; text?: string | null }[]
  recommendations: { area: string; areaLabel: string; freeFix: string; help: string; href: string }[]
}

/** Recommendation order when scores tie, by the goal chosen in question 2. */
const GOAL_PRIORITY: Record<string, string[]> = {
  enquiries: ['website', 'google', 'whatsapp', 'reviews', 'ads', 'social', 'booking', 'brand', 'tracking'],
  sales: ['booking', 'ads', 'website', 'social', 'whatsapp', 'google', 'reviews', 'tracking', 'brand'],
  brand: ['brand', 'social', 'website', 'reviews', 'google', 'whatsapp', 'ads', 'booking', 'tracking'],
  time: ['whatsapp', 'booking', 'tracking', 'website', 'social', 'ads', 'google', 'reviews', 'brand'],
}

export function Quiz({ data }: { data: QuizData }) {
  const [step, setStep] = useState(-1) // -1 start, 0..n-1 questions, n = result
  const [answers, setAnswers] = useState<(number | null)[]>(() => data.questions.map(() => null))
  const [unlocked, setUnlocked] = useState(false)
  const n = data.questions.length

  const result = useMemo(() => {
    let total = 0
    let max = 0
    const areaScores: Record<string, number> = {}
    let goal = 'enquiries'
    let industry: { label: string; value?: string | null } | null = null
    data.questions.forEach((q, i) => {
      const a = answers[i]
      if (q.kind === 'scored' && q.area) {
        const score = a ?? 0
        areaScores[q.area] = score
        total += score
        max += 3
      } else if (q.kind === 'goal' && a != null) {
        goal = q.answers[a]?.value || goal
      } else if (q.kind === 'industry' && a != null) {
        industry = q.answers[a] || null
      }
    })
    const pct = max ? Math.round((total / max) * 100) : 0
    const band = data.bands.find((b) => pct >= b.min && pct <= b.max) || data.bands[0]
    const priority = GOAL_PRIORITY[goal] || GOAL_PRIORITY.enquiries
    const weakest = Object.entries(areaScores)
      .sort((a, b) => a[1] - b[1] || priority.indexOf(a[0]) - priority.indexOf(b[0]))
      .slice(0, 3)
      .map(([area]) => area)
    return { pct, band, areaScores, weakest, goal, industry: industry as { label: string; value?: string | null } | null }
  }, [answers, data])

  const choose = (i: number) => {
    const next = [...answers]
    next[step] = i
    setAnswers(next)
    window.setTimeout(() => setStep((s) => Math.min(s + 1, n)), 180)
  }

  const onDone = useCallback(() => setUnlocked(true), [])

  if (step === -1) {
    return (
      <div className="quiz-card">
        <h1>{data.h1}</h1>
        <p className="hero-sub">{data.line}</p>
        <p className="reassure">{data.reassurance}</p>
        <button className="btn btn-primary btn-lg" onClick={() => setStep(0)}>
          {data.startLabel}
        </button>
      </div>
    )
  }

  if (step < n) {
    const q = data.questions[step]
    return (
      <div className="quiz-card" aria-live="polite">
        <div className="quiz-progress" aria-hidden="true">
          <span style={{ width: `${((step + 1) / n) * 100}%` }} />
        </div>
        <p className="quiz-count">
          Question {step + 1} of {n}
        </p>
        <h2 className="quiz-q">{q.question}</h2>
        <div className="quiz-answers" role="radiogroup" aria-label={q.question}>
          {q.answers.map((a, i) => (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={answers[step] === i}
              className={answers[step] === i ? 'quiz-answer selected' : 'quiz-answer'}
              onClick={() => choose(i)}
            >
              {a.label}
            </button>
          ))}
        </div>
        <div className="quiz-nav">
          <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft aria-hidden="true" size={18} />
            <span>Back</span>
          </button>
          <button type="button" className="btn btn-secondary" disabled={answers[step] == null} onClick={() => setStep((s) => s + 1)}>
            <span>Next</span>
            <ArrowRight aria-hidden="true" size={18} />
          </button>
        </div>
      </div>
    )
  }

  const recs = result.weakest
    .map((area) => data.recommendations.find((r) => r.area === area))
    .filter(Boolean) as QuizData['recommendations']
  const industryHref = result.industry?.value ? `/industries/${result.industry.value}/` : null

  return (
    <div className="quiz-result">
      <div className="quiz-card score-card">
        <p className="eyebrow">Your digital health score</p>
        <p className="score" aria-label={`${result.pct} percent`}>
          {result.pct}%
        </p>
        <h2>{result.band?.name}</h2>
        {result.band?.text && <p className="hero-sub">{result.band.text}</p>}
        <div className="meter" aria-hidden="true">
          <span style={{ width: `${result.pct}%` }} />
        </div>
      </div>

      {!unlocked ? (
        <div className="quiz-card">
          <h2>{data.gateHeading}</h2>
          <p>{data.gateLine}</p>
          <LeadForm
            source="quiz"
            fields={[
              { name: 'name', label: 'Name', type: 'text', required: true, autoComplete: 'name' },
              { name: 'business', label: 'Business name', type: 'text', required: true, autoComplete: 'organization' },
              { name: 'contact', label: 'WhatsApp number or email', type: 'text', required: true, full: true },
            ]}
            submitLabel={data.gateButton}
            consent={data.gateConsent}
            page="/quiz/"
            extraHidden={{
              interest: `Health check ${result.pct}% (${result.band?.name})`,
              quiz: JSON.stringify({ score: result.pct, band: result.band?.name, areas: result.areaScores, weakest: result.weakest, goal: result.goal, industry: result.industry?.label }),
            }}
            onDone={onDone}
            compact
          />
        </div>
      ) : (
        <>
          <div className="quiz-card">
            <h2>Your nine areas</h2>
            <ul className="area-bars">
              {data.recommendations.map((r) => {
                const s = result.areaScores[r.area] ?? 0
                return (
                  <li key={r.area}>
                    <span>{r.areaLabel}</span>
                    <span className="bar" aria-hidden="true">
                      <span style={{ width: `${(s / 3) * 100}%` }} />
                    </span>
                    <span className="bar-val">{s}/3</span>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="quiz-card">
            <h2>Your top three fixes</h2>
            <ol className="recs">
              {recs.map((r) => (
                <li key={r.area}>
                  <h3>{r.areaLabel}</h3>
                  <p>
                    <strong>Free fix you can do this week:</strong> {r.freeFix}
                  </p>
                  <p>
                    <strong>When you want help:</strong> <Link href={r.href}>{r.help}</Link>
                  </p>
                </li>
              ))}
            </ol>
            {industryHref && (
              <p>
                See how we help businesses like yours: <Link href={industryHref}>{result.industry?.label}</Link>.
              </p>
            )}
            <p className="small">We&apos;ve saved your report. One of the team will send it to you too.</p>
          </div>
        </>
      )}

      <div className="quiz-card cta-band-lite">
        <p>{data.resultFooter}</p>
        <div className="btn-row">
          <EnquiryButton waUrl={data.waHref} consent={data.gateConsent} message={data.waMessage} interest="Digital Health Check follow-up" />
          <Link className="btn btn-primary" href="/free-strategy-call/">
            Book this week&apos;s free call
          </Link>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setAnswers(data.questions.map(() => null))
            setUnlocked(false)
            setStep(-1)
          }}
        >
          Start again
        </button>
      </div>
    </div>
  )
}
