// The shape of every revision page. Prose fields are markdown.
//
// A page is written for the night before an interview: what the question is really
// asking, the words to say, the answer you can reveal, and the follow-ups that come next.

import type { JudgeSpec, Test } from "../runner/judge.ts";

export type Difficulty = "Easy" | "Medium" | "Hard";

/** A term the interviewer listens for, and what it means in one line. */
export type Keyword = { term: string; meaning: string };

export type QA = { q: string; a: string };

export type Complexity = {
  time: string;
  space: string;
  /** Why it is that complexity, counted from the code. */
  why: string;
};

export type Approach = {
  name: string;
  /** The idea in two or three sentences. */
  idea: string;
  complexity: Complexity;
  code: string;
};

/** A case to predict before revealing the output. */
export type Predict = { input: string; output: string; why: string };

export type Example = { input: string; output: string; explain?: string };

export type ProblemNote = {
  /** Same slug as the sheet entry. */
  slug: string;
  pattern: string;
  topics: string[];
  /** Companies reported to ask it, from public interview reports. */
  companies: string[];
  /** One line: what the problem is really testing. */
  gist: string;
  statement: string;
  constraints: string[];
  examples: Example[];
  predict: Predict[];
  edgeCases: string[];
  hints: [string, string, string];
  /** Brute force first, optimal last. The last one is "the answer". */
  approaches: Approach[];
  /** Why the complexity matters here: what breaks at scale, what the interviewer is probing. */
  complexityTalk: string;
  interview: {
    /** The answer said out loud, in about 60 seconds. */
    script: string;
    keywords: Keyword[];
    bonus: string[];
    mistakes: string[];
    followUps: QA[];
  };
  /** Shown in the editor before you type. */
  starter: string;
  /** Overrides the sheet's judge tests. */
  tests?: Test[];
};

export type ConceptSection = { heading: string; body: string };

export type ConceptNote = {
  slug: string;
  title: string;
  /** Why this page is worth reading before an interview. */
  why: string;
  minutes: number;
  sections: ConceptSection[];
  keywords: Keyword[];
  bonus: string[];
  questions: QA[];
  /** The page in five lines, for the last look before the call. */
  recap: string[];
};
