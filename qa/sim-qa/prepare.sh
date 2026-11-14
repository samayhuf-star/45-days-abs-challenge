#!/usr/bin/env bash
# Optional prepare for AI-Samay/sim-qa-runner (after pod install, before the build).
# Copies storekit/Abs45.storekit into the generated ios/ folder when present.
# Does not start a sim-qa run, EAS build, or App Store Connect write.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="${OUT:-$PWD/artifacts}"
mkdir -p "$OUT"
if [ -d "$ROOT/ios" ] && [ -f "$ROOT/storekit/Abs45.storekit" ]; then
  cp "$ROOT/storekit/Abs45.storekit" "$ROOT/ios/Abs45.storekit"
  echo "prepare: copied storekit/Abs45.storekit to ios/Abs45.storekit" | tee -a "$OUT/prepare.log"
else
  echo "prepare: no generated ios/ folder yet, or storekit file missing; skipping copy" | tee -a "$OUT/prepare.log"
fi
