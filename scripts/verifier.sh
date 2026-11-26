#!/usr/bin/env bash
# Vérifie que l'environnement est prêt pour fabriquer des réels.
ok() { printf "  ✓ %s\n" "$1"; }; ko() { printf "  ✗ %s\n" "$1"; BAD=1; }
echo "Klubik · vérification de l'environnement"
[ -f montage/compose.ts ] && ok "montage/ présent" || ko "dossier montage/ manquant"
[ -d motion/templates ] && ok "modèles de réels présents" || ko "motion/templates manquant"
[ -d public/brand/kit ] && ok "kit de marque présent" || ko "public/brand/kit manquant"
command -v ffmpeg >/dev/null && ok "ffmpeg" || ko "ffmpeg absent"
if [ -d motion/node_modules/hyperframes ]; then ok "HyperFrames $(cd motion && npx --no-install hyperframes --version 2>/dev/null | tail -1)"; else ko "HyperFrames non installé : cd motion && npm install"; fi
for h in drive.google.com api.apify.com kublik.vercel.app; do
  code=$(curl -s -o /dev/null -m 8 -w "%{http_code}" "https://$h/" 2>/dev/null); [ "$code" != "000" ] && ok "réseau : $h" || ko "réseau bloqué : $h (domaine à autoriser)"
done
[ -z "$BAD" ] && echo "Tout est prêt." || echo "Il manque des éléments : voir ci-dessus."
