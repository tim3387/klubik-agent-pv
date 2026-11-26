/**
 * The Monteur's montage plan: what Claude decides (which takes, in which order,
 * which words carry weight, which card when), never pixels. `compose.ts` turns
 * it into a HyperFrames composition in the exact style of the 11 references
 * (docs/STYLE-REELS.md), so the look never depends on the model.
 */

/** One word of a rush's transcript, in seconds of the rush. */
export interface Word {
  text: string;
  start: number;
  end: number;
}

/** What the worker learns about a rush before the Monteur sees it. */
export interface RushMaterial {
  id: string;
  /** Path of the file inside the composition project (assets/rushes/<id>.mp4) */
  src: string;
  durationSec: number;
  width: number;
  height: number;
  words: Word[];
  /** Where the face is, 0–1 from the left / top: the close-up zooms on it. */
  focus?: { x: number; y: number };
}

/** A word reference: "<rushId>:<index in that rush's words>". */
export type WordRef = string;

export interface Shot {
  rushId: string;
  /** Seconds in the rush */
  in: number;
  out: number;
  /** Large (plan taille) or tight (plan serré, zoom on the face) */
  framing: "large" | "serre";
}

export interface MontagePlan {
  title: string;
  /** Closest Klubik reference reel (src/lib/references.ts) */
  referenceId: string | null;
  shots: Shot[];
  /** Hook: the first sentence as a giant title over the darkened image. Its words leave the subtitles. */
  hook: { from: WordRef; to: WordRef; small: string; big: string; under?: string } | null;
  /** Words set in the bold grotesque (« cle ») or in a white block with blue text (« bloc »). Others are the thin italic serif. */
  emphasis: { word: WordRef; style: "cle" | "bloc" }[];
  /** White floating cards, top right, one at a time, filling while Tim speaks. */
  cards: {
    kind: "liste" | "compteur";
    title: string;
    /** liste: the lines that tick one after another */
    items: string[];
    /** compteur: the number reached, and its unit (« jours », « € ») */
    value?: number;
    unit?: string;
    from: WordRef;
    to: WordRef;
  }[];
  /** At most one full-screen blue shot, for the key sentence. Its words leave the subtitles. */
  bluePlan: { from: WordRef; to: WordRef; text: string } | null;
  /** Kubo enters and waves, at most once. */
  kubo: { at: WordRef } | null;
  /** Face position per rush, read on the keyframes: the close-up zooms on it. */
  faces?: { rushId: string; x: number; y: number }[];
  /** The Monteur's note for the manager (what was kept, why). */
  note: string;
}

export const OUTRO_SEC = 3.3;
export const FPS = 30;
