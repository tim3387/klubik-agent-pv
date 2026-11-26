import { FPS, OUTRO_SEC, type MontagePlan, type RushMaterial, type Word, type WordRef } from "./types";

/**
 * MontagePlan → HyperFrames composition (one standalone index.html), in the
 * style of the Klubik references (docs/STYLE-REELS.md §4–6):
 * - square 1080 × 1080, 30 fps (the 9:16 export is this square on black bands);
 * - word-by-word subtitles beside the face: link words in a thin italic serif,
 *   key words in a wide heavy grotesque, at most one white block with blue text;
 * - hook as a giant title over the darkened image, blue glow;
 * - one white floating card at a time, top right, filling while Tim speaks;
 * - at most one full-screen blue shot, Kubo at most once;
 * - 3.3 s outro: blue Klubik logo on black, fade in and out.
 * Pure: no I/O. The worker copies the rushes and assets next to it.
 */

const SIZE = 1080;
const BLUE = "#1353F4";
const MIN_SHOT = 0.4;

/** Files the composition needs besides index.html (copied from /public/montage). */
export const STATIC_ASSETS = ["gsap.min.js", "logo.png", "kubo.png"] as const;

interface PlacedShot {
  id: string;
  rush: RushMaterial;
  in: number;
  out: number;
  start: number;
  dur: number;
  framing: "large" | "serre";
}

interface PlacedWord {
  ref: WordRef;
  text: string;
  start: number;
  end: number;
  style: "lien" | "cle" | "bloc";
}

export interface Composition {
  html: string;
  durationSec: number;
  /** Rush ids used, so the worker only downloads those */
  rushIds: string[];
  /** Subtitled words, in output seconds (also the reel's caption text) */
  words: PlacedWord[];
}

/**
 * « reference »: the references as they are. « premium »: same grammar (places,
 * colours, fonts, structure), finer motion design — slow push-in on every shot,
 * blurred whips between framings, words that resolve out of a blur, frosted
 * glass cards, a letter-by-letter hook, a diagonal lightning blue shot.
 */
export type Finish = "reference" | "premium";

export function compose(plan: MontagePlan, rushes: RushMaterial[], opts: { finish?: Finish } = {}): Composition {
  const premium = (opts.finish ?? "premium") === "premium";
  const faces = new Map((plan.faces ?? []).map((f) => [f.rushId, { x: f.x, y: f.y }]));
  const byId = new Map(rushes.map((r) => [r.id, { ...r, focus: faces.get(r.id) ?? r.focus }]));

  // 1. Shots, end to end.
  const shots: PlacedShot[] = [];
  let t = 0;
  for (const s of plan.shots) {
    const rush = byId.get(s.rushId);
    if (!rush) continue;
    const inSec = clamp(s.in, 0, rush.durationSec);
    const outSec = clamp(s.out, inSec, rush.durationSec);
    const dur = round(outSec - inSec);
    if (dur < MIN_SHOT) continue;
    shots.push({ id: `shot-${shots.length + 1}`, rush, in: round(inSec), out: round(outSec), start: round(t), dur, framing: s.framing });
    t += dur;
  }
  if (!shots.length) throw new Error("Le plan de montage ne contient aucun plan utilisable.");
  const contentEnd = round(t);
  const total = round(contentEnd + OUTRO_SEC);

  // 2. Words, mapped from rush time to output time.
  const toOut = (rushId: string, sec: number) => {
    const s = shots.find((x) => x.rush.id === rushId && sec >= x.in && sec < x.out);
    return s ? round(s.start + (sec - s.in)) : null;
  };
  const emphasis = new Map(plan.emphasis.map((e) => [e.word, e.style]));
  let blocUsed = false;
  const words: PlacedWord[] = [];
  for (const s of shots) {
    s.rush.words.forEach((w: Word, i) => {
      if (w.start < s.in || w.start >= s.out) return;
      const ref = `${s.rush.id}:${i}`;
      let style: PlacedWord["style"] = emphasis.get(ref) ?? "lien";
      if (style === "bloc") {
        if (blocUsed) style = "cle";
        blocUsed = true;
      }
      words.push({
        ref,
        text: w.text.trim(),
        start: round(s.start + (w.start - s.in)),
        end: round(s.start + (Math.min(w.end, s.out) - s.in)),
        style,
      });
    });
  }
  words.sort((a, b) => a.start - b.start);
  const at = (ref: WordRef | undefined, edge: "start" | "end") => {
    const w = ref ? words.find((x) => x.ref === ref) : undefined;
    if (w) return w[edge];
    // A word outside the kept shots: fall back to its rush time, if inside a shot.
    const [rushId, idx] = (ref ?? "").split(":");
    const src = byId.get(rushId)?.words[Number(idx)];
    return src ? toOut(rushId, src[edge]) : null;
  };
  const range = (from: WordRef, to: WordRef, minDur: number) => {
    const a = at(from, "start");
    if (a === null || a >= contentEnd - 0.5) return null;
    // An end word cut out of the montage: keep the overlay a few seconds.
    const b = at(to, "end") ?? a + 3;
    return { start: a, end: round(Math.min(contentEnd, Math.max(b, a + minDur))) };
  };

  const hook = plan.hook ? range(plan.hook.from, plan.hook.to, 1.6) : null;
  const blue = plan.bluePlan ? range(plan.bluePlan.from, plan.bluePlan.to, 1.2) : null;
  const silenced = (w: PlacedWord) => [hook, blue].some((r) => r && w.start >= r.start - 0.05 && w.start < r.end);
  const subtitled = words.filter((w) => !silenced(w));

  // 3. Markup + timeline.
  const parts: string[] = [];
  const tl: string[] = [];
  let z = 1;

  parts.push(`<div id="bg" style="position:absolute;inset:0;background:#000;z-index:0"></div>`);
  // Each shot sits in an untimed wrapper that GSAP may move (push-in, whip);
  // the <video> inside carries the timing (HyperFrames: time the media, move its parent).
  let framingChanges = 0;
  shots.forEach((s, i) => {
    const fx = s.rush.focus?.x ?? 0.5;
    const fy = s.rush.focus?.y ?? 0.38;
    const zoom = s.framing === "serre" ? 1.45 : 1;
    const origin = `${pct(fx)} ${pct(fy)}`;
    parts.push(
      `<div id="sw-${i}" class="shot" style="position:absolute;inset:0;z-index:${z++};transform-origin:${origin}">` +
        `<video id="${s.id}" class="clip" src="${esc(s.rush.src)}" data-start="${s.start}" data-duration="${s.dur}" data-media-start="${s.in}" data-track-index="1" playsinline data-has-audio="true" ` +
        `style="position:absolute;left:0;top:0;width:${SIZE}px;height:${SIZE}px;object-fit:cover;object-position:${origin};transform:scale(${zoom});transform-origin:${origin}"></video></div>`,
    );
    if (premium) tl.push(`tl.fromTo("#sw-${i}",{scale:1},{scale:1.045,duration:${s.dur},ease:"none"},${s.start});`);
    // Whip (motion blur) between two framings, at most every other change, as in the references.
    const prev = shots[i - 1];
    if (prev && prev.framing !== s.framing && framingChanges++ % 2 === 0 && prev.dur > 0.6 && s.dur > 0.6) {
      const dir = framingChanges % 4 === 1 ? -1 : 1;
      tl.push(
        `tl.fromTo("#sw-${i - 1}",{x:0,filter:"blur(0px)"},{x:${dir * 140},filter:"blur(18px)",duration:0.13,ease:"power2.in"},${round(s.start - 0.13)});`,
        `tl.fromTo("#sw-${i}",{x:${-dir * 140},filter:"blur(18px)"},{x:0,filter:"blur(0px)",duration:0.16,ease:"power3.out"},${s.start});`,
      );
    }
  });

  // Hook: darkened image + giant title with a blue glow.
  if (plan.hook && hook) {
    const d = round(hook.end - hook.start + 0.2);
    parts.push(
      `<div id="hook-dim" class="clip" data-start="${hook.start}" data-duration="${d}" data-track-index="2" style="position:absolute;inset:0;z-index:20"><div id="hook-dim-fill" style="position:absolute;inset:0;background:#000;opacity:0"></div></div>`,
      `<div id="hook" class="clip" data-start="${hook.start}" data-duration="${d}" data-track-index="3" data-layout-allow-overlap style="position:absolute;left:0;right:0;top:${SIZE * 0.07}px;z-index:31;text-align:center;color:#fff">` +
        `<div id="hook-small" class="serif" style="font-size:62px;line-height:1.05;opacity:0">${esc(plan.hook.small)}</div>` +
        `<div id="hook-big" class="grotesque glow" style="font-size:${bigSize(plan.hook.big)}px;line-height:0.95;text-transform:uppercase;letter-spacing:0.01em;opacity:0">${
          premium ? hookLetters(plan.hook.big) : esc(plan.hook.big)
        }</div>` +
        (plan.hook.under ? `<div id="hook-under" class="grotesque" style="font-size:34px;margin-top:34px;font-weight:700;opacity:0">${esc(plan.hook.under)}</div>` : "") +
        `</div>`,
    );
    const span = hook.end - hook.start;
    tl.push(
      `tl.fromTo("#hook-dim-fill",{opacity:0},{opacity:0.55,duration:0.25,ease:"power2.out"},${hook.start});`,
      `tl.fromTo("#hook-small",{opacity:0,y:18},{opacity:1,y:0,duration:0.3,ease:"power3.out"},${hook.start});`,
      `tl.fromTo("#hook-big",{opacity:0,scale:1.18},{opacity:1,scale:1,duration:0.35,ease:"power4.out"},${round(hook.start + Math.min(0.35, span * 0.25))});`,
    );
    if (premium) {
      const t0 = round(hook.start + Math.min(0.35, span * 0.25));
      [...plan.hook.big].forEach((_, ci) =>
        tl.push(`tl.fromTo("#hook-c${ci}",{opacity:0,y:40,filter:"blur(14px)"},{opacity:1,y:0,filter:"blur(0px)",duration:0.32,ease:"power3.out"},${round(t0 + ci * 0.045)});`),
      );
      tl.push(`tl.fromTo("#hook-big",{textShadow:"0 0 0px rgba(19,83,244,0)"},{textShadow:"0 0 46px rgba(19,83,244,1)",duration:0.5,ease:"sine.inOut",yoyo:true,repeat:1},${round(t0 + 0.3)});`);
    }
    if (plan.hook.under) tl.push(`tl.fromTo("#hook-under",{opacity:0,y:14},{opacity:1,y:0,duration:0.3,ease:"power3.out"},${round(hook.start + span * 0.6)});`);
  }

  // Subtitles: word by word, beside the face (lower right), grouped in short lines.
  const lines = groupLines(subtitled);
  parts.push(`<div id="captions" data-track-kind="captions" style="position:absolute;inset:0;z-index:30">`);
  lines.forEach((line, li) => {
    const next = lines[li + 1];
    const start = line[0].start;
    const end = round(Math.min(next ? next[0].start : contentEnd, line[line.length - 1].end + 0.35, contentEnd));
    const dur = round(Math.max(0.2, end - start));
    const spans = line
      .map((w, wi) => {
        const cls = w.style === "lien" ? "serif" : w.style === "cle" ? "grotesque" : "grotesque bloc";
        return `<span id="w-${li}-${wi}" class="${cls}" style="display:inline-block">${esc(w.text)}</span>`;
      })
      .join(" ");
    parts.push(
      `<div id="cap-${li}" class="clip cap" data-start="${start}" data-duration="${dur}" data-track-index="4" data-layout-allow-overlap>${spans}</div>`,
    );
    line.forEach((w, wi) => {
      if (!premium) {
        tl.push(`tl.fromTo("#w-${li}-${wi}",{opacity:0,y:10},{opacity:1,y:0,duration:0.09,ease:"power2.out"},${w.start});`);
      } else if (w.style === "lien") {
        tl.push(`tl.fromTo("#w-${li}-${wi}",{opacity:0,y:14,filter:"blur(8px)"},{opacity:1,y:0,filter:"blur(0px)",duration:0.16,ease:"power3.out"},${w.start});`);
      } else if (w.style === "cle") {
        tl.push(`tl.fromTo("#w-${li}-${wi}",{opacity:0,scale:1.28,filter:"blur(6px)"},{opacity:1,scale:1,filter:"blur(0px)",duration:0.22,ease:"back.out(2.2)"},${w.start});`);
      } else {
        tl.push(
          `tl.fromTo("#w-${li}-${wi}",{opacity:1,clipPath:"inset(0 100% 0 0)"},{clipPath:"inset(0 0% 0 0)",duration:0.2,ease:"power3.out"},${w.start});`,
        );
      }
    });
  });
  parts.push(`</div>`);

  // Cards: one at a time, top right.
  const cards = plan.cards
    .map((c) => ({ c, r: range(c.from, c.to, 1.5) }))
    .filter((x): x is { c: MontagePlan["cards"][number]; r: { start: number; end: number } } => x.r !== null)
    .sort((a, b) => a.r.start - b.r.start);
  let cardFree = 0;
  cards.forEach(({ c, r }, ci) => {
    const start = Math.max(r.start, cardFree);
    const end = r.end;
    if (end - start < 1.2) return;
    cardFree = end + 0.2;
    const dur = round(end - start);
    const id = `card-${ci}`;
    const body =
      c.kind === "compteur"
        ? `<div style="display:flex;align-items:baseline;gap:12px;margin-top:10px"><span id="${id}-n" class="grotesque" style="font-size:108px;line-height:1" class="card-num">0</span><span class="grotesque card-num" style="font-size:30px">${esc(c.unit ?? "")}</span></div>`
        : `<ul style="list-style:none;margin:16px 0 0;padding:0;display:flex;flex-direction:column;gap:14px">${c.items
            .slice(0, 5)
            .map(
              (it, ii) =>
                `<li id="${id}-i${ii}" style="display:flex;align-items:center;gap:14px;opacity:0"><span id="${id}-c${ii}" style="flex:none;width:34px;height:34px;border-radius:50%;border:3px solid ${BLUE};display:grid;place-items:center;color:#fff;background:#fff">${CHECK}</span><span class="card-item">${esc(it)}</span></li>`,
            )
            .join("")}</ul>`;
    parts.push(
      `<div id="${id}" class="clip" data-start="${round(start)}" data-duration="${dur}" data-track-index="5" style="position:absolute;top:${SIZE * 0.06}px;right:${SIZE * 0.06}px;width:400px;z-index:40">` +
        `<div id="${id}-box" class="${premium ? "card glass" : "card"}" style="opacity:0">` +
        `<div class="card-title">${esc(c.title)}</div>` +
        `<div class="card-rule"></div>${body}</div></div>`,
    );
    tl.push(
      premium
        ? `tl.fromTo("#${id}-box",{opacity:0,scale:0.9,y:-24,rotationX:-18,transformPerspective:800,filter:"blur(10px)"},{opacity:1,scale:1,y:0,rotationX:0,filter:"blur(0px)",duration:0.5,ease:"expo.out"},${round(start)});`
        : `tl.fromTo("#${id}-box",{opacity:0,scale:0.86,y:-16},{opacity:1,scale:1,y:0,duration:0.38,ease:"back.out(1.6)"},${round(start)});`,
    );
    tl.push(`tl.to("#${id}-box",{opacity:0,y:-10,duration:0.22,ease:"power2.in"},${round(end - 0.24)});`);
    if (c.kind === "compteur") {
      const v = Math.round(c.value ?? 0);
      tl.push(
        `(function(){var o={v:0};tl.fromTo(o,{v:0},{v:${v},duration:${round(Math.min(1.4, dur * 0.5))},ease:"power2.out",onUpdate:function(){document.getElementById("${id}-n").textContent=Math.round(o.v).toLocaleString("fr-FR")}},${round(start + 0.3)});})();`,
      );
    } else {
      const n = Math.min(5, c.items.length);
      const step = (dur - 0.8) / Math.max(1, n);
      for (let ii = 0; ii < n; ii++) {
        const tt = round(start + 0.45 + ii * step);
        tl.push(
          `tl.fromTo("#${id}-i${ii}",{opacity:0,x:16},{opacity:1,x:0,duration:0.25,ease:"power3.out"},${tt});`,
          `tl.fromTo("#${id}-c${ii}",{backgroundColor:"#ffffff"},{backgroundColor:"${BLUE}",duration:0.18},${round(tt + 0.25)});`,
        );
      }
    }
  });

  // Kubo: enters bottom right, waves, leaves.
  if (plan.kubo) {
    const s = at(plan.kubo.at, "start");
    if (s !== null && s < contentEnd - 1) {
      const d = round(Math.min(2.4, contentEnd - s));
      parts.push(
        `<div id="kubo" class="clip" data-start="${s}" data-duration="${d}" data-track-index="6" style="position:absolute;left:24px;bottom:0;width:250px;height:350px;z-index:45" data-layout-allow-overflow>` +
          `<img id="kubo-img" src="assets/kubo.png" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:bottom"></div>`,
      );
      tl.push(
        `tl.fromTo("#kubo-img",{y:380},{y:0,duration:0.45,ease:"back.out(1.4)"},${s});`,
        `tl.fromTo("#kubo-img",{rotation:-5},{rotation:5,duration:0.25,ease:"sine.inOut",yoyo:true,repeat:3},${round(s + 0.5)});`,
        `tl.to("#kubo-img",{y:380,duration:0.35,ease:"power2.in"},${round(s + d - 0.4)});`,
      );
    }
  }

  // Full-screen blue shot for the key sentence.
  if (plan.bluePlan && blue) {
    const d = round(blue.end - blue.start);
    parts.push(
      `<div id="blue" class="clip" data-start="${blue.start}" data-duration="${d}" data-track-index="7" style="position:absolute;inset:0;z-index:50">` +
        `<div id="blue-fill" style="position:absolute;inset:0;background:${BLUE};overflow:hidden">` +
        `<img src="assets/logo.png" alt="" style="position:absolute;width:1500px;left:-220px;top:380px;opacity:.10;filter:brightness(0) invert(1)">` +
        `<div id="blue-text" class="grotesque" style="position:absolute;left:90px;right:90px;top:50%;font-size:${blueSize(plan.bluePlan.text)}px;line-height:1.08;color:#fff;text-align:center">${esc(plan.bluePlan.text)}</div></div></div>`,
    );
    tl.push(
      premium
        ? `tl.fromTo("#blue-fill",{clipPath:"polygon(0 0,0 0,-30% 100%,-30% 100%)"},{clipPath:"polygon(0 0,130% 0,100% 100%,-30% 100%)",duration:0.32,ease:"expo.inOut"},${blue.start});`
        : `tl.fromTo("#blue-fill",{clipPath:"polygon(0 0,0 0,0 100%,0 100%)"},{clipPath:"polygon(0 0,100% 0,100% 100%,0 100%)",duration:0.28,ease:"power3.inOut"},${blue.start});`,
      `tl.fromTo("#blue-text",{opacity:0,yPercent:-40},{opacity:1,yPercent:-50,duration:0.35,ease:"power3.out"},${round(blue.start + 0.2)});`,
    );
  }

  // Outro: blue logo on black, fade in and out.
  parts.push(
    `<div id="outro" class="clip" data-start="${contentEnd}" data-duration="${OUTRO_SEC}" data-track-index="8" style="position:absolute;inset:0;background:#000;z-index:60">` +
      `<img id="outro-logo" src="assets/logo.png" alt="Klubik" style="position:absolute;left:50%;top:50%;width:560px;margin-left:-280px;margin-top:-82px;opacity:0"></div>`,
  );
  tl.push(
    premium
      ? `tl.fromTo("#outro-logo",{opacity:0,scale:0.92,filter:"blur(12px)"},{opacity:1,scale:1,filter:"blur(0px)",duration:0.8,ease:"expo.out"},${round(contentEnd + 0.15)});`
      : `tl.fromTo("#outro-logo",{opacity:0},{opacity:1,duration:0.6,ease:"power1.out"},${round(contentEnd + 0.15)});`,
    `tl.to("#outro-logo",{opacity:0,duration:0.6,ease:"power1.in"},${round(total - 0.75)});`,
  );

  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=${SIZE}, height=${SIZE}">
<title>${esc(plan.title)}</title>
<script src="assets/gsap.min.js"></script>
<style>
*{box-sizing:border-box}
html,body{margin:0;width:${SIZE}px;height:${SIZE}px;overflow:hidden;background:#000}
#root{position:relative;width:${SIZE}px;height:${SIZE}px;overflow:hidden;background:#000}
.serif{font-family:"Playfair Display",serif;font-style:italic;font-weight:400}
.grotesque{font-family:Montserrat,sans-serif;font-weight:800;letter-spacing:.005em}
.glow{text-shadow:0 0 28px rgba(19,83,244,.95),0 0 60px rgba(19,83,244,.6)}
.cap{position:absolute;right:${SIZE * 0.07}px;bottom:${SIZE * 0.13}px;max-width:${SIZE * 0.66}px;text-align:right;color:#fff;font-size:58px;line-height:1.12;text-shadow:0 2px 14px rgba(0,0,0,.45)}
.cap .serif{font-size:66px}
.cap .grotesque{font-size:62px}
.bloc{display:inline-block;background:#fff;color:${BLUE};padding:2px 14px 6px;border-radius:6px;text-shadow:none}
.card{background:#fff;border-radius:30px;padding:28px 30px 30px;box-shadow:0 18px 50px rgba(0,0,0,.35)}
.card-title{font:800 21px/1 Montserrat;letter-spacing:.14em;text-transform:uppercase;color:${BLUE}}
.card-rule{height:3px;width:56px;background:${BLUE};margin-top:12px;border-radius:2px}
.card-item{font:600 27px/1.15 Montserrat;color:#0d0d0d}
.card-num{color:${BLUE}}
.glass{background:linear-gradient(140deg,rgba(255,255,255,.16),rgba(255,255,255,.04)),rgba(8,14,34,.56);backdrop-filter:blur(26px) saturate(170%);-webkit-backdrop-filter:blur(26px) saturate(170%);border:1.5px solid rgba(255,255,255,.55);box-shadow:inset 0 1px 0 rgba(255,255,255,.7),0 24px 60px rgba(0,0,0,.4)}
.glass .card-title{color:#fff}
.glass .card-rule{background:#fff}
.glass .card-item{color:#fff;text-shadow:0 1px 8px rgba(0,0,0,.25)}
.glass .card-num{color:#fff;text-shadow:0 0 24px rgba(19,83,244,.9)}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="${SIZE}" data-height="${SIZE}" data-fps="${FPS}">
${parts.join("\n")}
</div>
<script>
window.__timelines = window.__timelines || {};
var tl = gsap.timeline({ paused: true });
${tl.join("\n")}
window.__timelines["main"] = tl;
</script>
</body>
</html>
`;
  return { html, durationSec: total, rushIds: [...new Set(shots.map((s) => s.rush.id))], words };
}

/** Short lines that read at a glance: ≤ 3 words / 20 characters, broken on pauses, punctuation and cuts. */
function groupLines(words: PlacedWord[]): PlacedWord[][] {
  const lines: PlacedWord[][] = [];
  let cur: PlacedWord[] = [];
  for (const w of words) {
    const prev = cur[cur.length - 1];
    const chars = cur.reduce((n, x) => n + x.text.length + 1, 0) + w.text.length;
    const breakHere =
      prev &&
      (cur.length >= 3 || chars > 20 || w.start - prev.end > 0.4 || /[.?!,;:]$/.test(prev.text) || (w.style === "bloc" && cur.length > 0));
    if (breakHere) {
      lines.push(cur);
      cur = [];
    }
    cur.push(w);
  }
  if (cur.length) lines.push(cur);
  return lines;
}

const CHECK = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;

/** The letters of the hook, one span each (for the letter-by-letter reveal), grouped by word so a long word never breaks in the middle. */
function hookLetters(text: string) {
  let html = "";
  let word = "";
  const flush = () => {
    if (word) html += `<span style="display:inline-block;white-space:nowrap">${word}</span>`;
    word = "";
  };
  [...text].forEach((ch, ci) => {
    if (ch === " ") {
      flush();
      html += `<span id="hook-c${ci}" style="display:inline-block;width:.3em"></span>`;
    } else {
      word += `<span id="hook-c${ci}" style="display:inline-block">${esc(ch)}</span>`;
    }
  });
  flush();
  return html;
}
function bigSize(text: string) {
  const n = text.length;
  return n <= 6 ? 168 : n <= 9 ? 140 : n <= 13 ? 112 : 88;
}
function blueSize(text: string) {
  const n = text.length;
  return n <= 40 ? 92 : n <= 70 ? 74 : 58;
}
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, Number.isFinite(n) ? n : a));
}
function round(n: number) {
  return Math.round(n * 1000) / 1000;
}
function pct(n: number) {
  return `${Math.round(clamp(n, 0, 1) * 100)}%`;
}
