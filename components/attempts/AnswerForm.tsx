"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  generateFeedbackAction,
  getAttemptAction,
  submitAnswerAction,
  type SubmitAnswerState,
} from "@/app/actions/attempts";
import { Attempt } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { FeedbackPanel } from "./FeedbackPanel";
import { RotateCcw, Loader2, Mic, Square } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

const initialSubmitState: SubmitAnswerState = {};
const MAX_ANSWER_CHARS = 3000;

export function AnswerForm({
  questionId,
  existingAttempt,
}: {
  questionId: string;
  existingAttempt?: Attempt | null;
}) {
  const [attempt, setAttempt] = useState<Attempt | null>(
    existingAttempt ?? null
  );
  const [content, setContent] = useState("");
  const [submittedContent, setSubmittedContent] = useState<string | null>(
    existingAttempt?.content ?? null
  );
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [composeKey, setComposeKey] = useState(0);
  const [pendingFeedbackAttemptId, setPendingFeedbackAttemptId] = useState<
    string | null
  >(null);

  const [state, formAction, isPending] = useActionState(
    submitAnswerAction,
    initialSubmitState
  );

  const contentRef = useRef(content);
  contentRef.current = content;

  const isReviewing = attempt !== null || pendingFeedbackAttemptId !== null;
  const displayContent = attempt?.content ?? submittedContent ?? content;
  const canEdit = !isReviewing;

  const { isListening, stop, toggle, isSupported, errorMessage } =
    useSpeechRecognition({
      onTranscript: setContent,
    });

  useEffect(() => {
    if (isPending && isListening) {
      stop();
    }
  }, [isPending, isListening, stop]);

  useEffect(() => {
    if (!state.attemptId) return;
    setSubmittedContent(contentRef.current);
    setPendingFeedbackAttemptId(state.attemptId);
  }, [state.attemptId]);

  useEffect(() => {
    if (!pendingFeedbackAttemptId) return;

    let cancelled = false;
    const id = pendingFeedbackAttemptId;

    async function runFeedback() {
      try {
        const result = await generateFeedbackAction(id);
        if (cancelled) return;

        if ("error" in result && result.error) {
          setFeedbackError(result.error);
          const latest = await getAttemptAction(id);
          if (latest) setAttempt(latest);
          return;
        }

        if ("attempt" in result && result.attempt) {
          setAttempt(result.attempt);
        }
      } finally {
        setPendingFeedbackAttemptId((prev) => (prev === id ? null : prev));
      }
    }

    runFeedback();
    return () => {
      cancelled = true;
    };
  }, [pendingFeedbackAttemptId]);

  function handleRetry() {
    setAttempt(null);
    setSubmittedContent(null);
    setContent("");
    setFeedbackError(null);
    setPendingFeedbackAttemptId(null);
    setComposeKey((k) => k + 1);
  }

  const waitingForFeedback = pendingFeedbackAttemptId !== null && !attempt;

  return (
    <div className="relative space-y-8">
      {waitingForFeedback && (
        <div
          className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
          Generating AI feedback… This usually takes a few seconds.
        </div>
      )}

      <form action={formAction} className="space-y-6" key={composeKey}>
        <input type="hidden" name="questionId" value={questionId} />
        <Textarea
          name={canEdit ? "content" : undefined}
          value={displayContent}
          onChange={
            canEdit ? (e) => setContent(e.target.value) : undefined
          }
          placeholder="Write your answer here..."
          rows={11}
          required={canEdit}
          maxLength={MAX_ANSWER_CHARS}
          disabled={isPending}
          readOnly={!canEdit || isListening}
          aria-readonly={!canEdit || isListening}
          className={`min-h-[220px] rounded-xl border-border/80 resize-y shadow-sm focus-visible:ring-primary/40 text-[15px] leading-relaxed${
            !canEdit || isListening ? " cursor-default bg-muted/30" : ""
          }`}
        />
        {canEdit && isSupported && (
          <div className="flex flex-col items-end gap-2">
            <Button
              type="button"
              variant={isListening ? "destructive" : "outline"}
              size="sm"
              disabled={isPending}
              aria-label={
                isListening ? "Stop dictation" : "Start voice dictation"
              }
              className={`rounded-xl gap-2 ${isListening ? "ring-2 ring-destructive/40 ring-offset-2 ring-offset-background" : ""}`}
              aria-pressed={isListening}
              onClick={() => toggle(content)}
            >
              {isListening ? (
                <>
                  <Square className="h-3.5 w-3.5 fill-current" aria-hidden />
                  Stop dictation
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" aria-hidden />
                  Dictate
                </>
              )}
            </Button>
            {errorMessage && (
              <p className="text-xs text-destructive text-right max-w-md">
                {errorMessage}
              </p>
            )}
            <p className="text-xs text-muted-foreground text-right max-w-md">
              {isListening
                ? "Pause typing while recording — Stop dictation to edit."
                : ""}
            </p>
          </div>
        )}
        {state.error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
            {state.error}
          </div>
        )}
        {canEdit && (
          <Button
            type="submit"
            size="lg"
            className="h-11 rounded-xl shadow-md"
            disabled={isPending || isListening}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                Submitting…
              </>
            ) : (
              "Submit for AI feedback"
            )}
          </Button>
        )}
      </form>

      {attempt && (
        <>
          {feedbackError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
              {feedbackError}
            </div>
          )}
          <Separator className="opacity-50" />
          <FeedbackPanel attempt={attempt} />
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl gap-2"
              onClick={handleRetry}
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Submit another attempt
            </Button>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
              You can answer this question again. Earlier attempts remain in
              History.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
