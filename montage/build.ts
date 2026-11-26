/**
 * Montage face caméra : plan.json + rushes.json → un projet HyperFrames prêt à rendre.
 *
 *   npx tsx montage/build.ts <dossier-du-reel> <plan.json> <rushes.json> [reference|premium]
 *
 * rushes.json : [{ "id": "r1", "file": "chemin/vers/rush.mp4", "durationSec": 20.5,
 *                  "width": 1080, "height": 1920, "words": [{ "text": "Je", "start": 0, "end": 0.5 }, ...] }]
 * Les mots viennent de la transcription (voir la compétence createur-contenu, étape « transcrire »).
 * Le plan est décrit dans types.ts (MontagePlan). compose.ts dessine toujours pareil, au style des
 * réels Klubik : on ne le modifie pas pour un seul réel.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compose, STATIC_ASSETS, type Finish } from "./compose";
import type { MontagePlan, RushMaterial } from "./types";

const here = dirname(fileURLToPath(import.meta.url));
const [out, planFile, rushesFile, finishArg] = process.argv.slice(2);
if (!out || !planFile || !rushesFile) {
  console.error("Usage : npx tsx montage/build.ts <dossier-du-reel> <plan.json> <rushes.json> [reference|premium]");
  process.exit(1);
}

const plan = JSON.parse(readFileSync(planFile, "utf8")) as MontagePlan;
const raw = JSON.parse(readFileSync(rushesFile, "utf8")) as (Omit<RushMaterial, "src"> & { file: string })[];
const project = resolve(out);
mkdirSync(join(project, "assets", "rushes"), { recursive: true });

const rushes: RushMaterial[] = raw.map((r) => {
  const dest = `assets/rushes/${r.id}.mp4`;
  copyFileSync(resolve(r.file), join(project, dest));
  const { file: _file, ...rest } = r;
  void _file;
  return { ...rest, src: dest };
});
for (const f of STATIC_ASSETS) copyFileSync(join(here, "assets", f), join(project, "assets", f));
mkdirSync(join(project, "assets", "fonts"), { recursive: true });
for (const f of ["montserrat-latin-700-normal.woff2", "montserrat-latin-800-normal.woff2", "playfair-display-latin-400-italic.woff2"]) {
  copyFileSync(join(here, "fonts", f), join(project, "assets", "fonts", f));
}

const finish: Finish = finishArg === "reference" ? "reference" : "premium";
const c = compose(plan, rushes, { finish });
// Les polices viennent du dossier du projet : le rendu ne dépend d'aucun accès réseau.
const faces = `@font-face{font-family:Montserrat;font-weight:700;src:url(assets/fonts/montserrat-latin-700-normal.woff2) format("woff2")}
@font-face{font-family:Montserrat;font-weight:800;src:url(assets/fonts/montserrat-latin-800-normal.woff2) format("woff2")}
@font-face{font-family:"Playfair Display";font-style:italic;font-weight:400;src:url(assets/fonts/playfair-display-latin-400-italic.woff2) format("woff2")}
`;
const html = c.html.replace("<style>", `<style>\n${faces}`);
writeFileSync(join(project, "index.html"), html);
if (!existsSync(join(project, "index.html"))) process.exit(1);
console.log(`OK · ${c.durationSec.toFixed(1)} s · ${c.words.length} mots sous-titrés · rushes : ${c.rushIds.join(", ")}`);
console.log(`Ensuite : npx hyperframes lint ${out} && npx hyperframes render ${out} --output ${out}/brouillon.mp4 --quality draft`);
