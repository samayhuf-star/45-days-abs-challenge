#!/usr/bin/env bash
# 45 Days Abs Challenge flow for AI-Samay/sim-qa-runner.
# Env from the workflow: UDID, BUNDLE_ID, SCHEME, WORKSPACE, DERIVED_DATA, OUT.
# Installs the Release .app, launches it, and uses Maestro testIDs to capture
# home/calendar, a day's workout, progress, and the paywall for store shots.
# This script does not start a CI run, EAS build, or App Store Connect write.
set -euo pipefail
: "${UDID:?}" "${BUNDLE_ID:?}" "${OUT:?}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
mkdir -p "$OUT/screenshots" "$OUT/maestro"

echo "==> Boot simulator $UDID"
xcrun simctl boot "$UDID" 2>/dev/null || true
xcrun simctl bootstatus "$UDID" -b
export SIMCTL_CHILD_UDID="$UDID"

echo "==> Locate .app"
APP=""
if [ -n "${DERIVED_DATA:-}" ]; then
  APP="$(find "$DERIVED_DATA/Build/Products" -path '*iphonesimulator/*.app' -maxdepth 3 2>/dev/null | head -n1 || true)"
  if [[ -z "$APP" && -n "${SCHEME:-}" ]]; then
    APP="$(find "$DERIVED_DATA/Build/Products" -name "$SCHEME.app" 2>/dev/null | head -n1 || true)"
  fi
fi
if [[ -z "$APP" ]]; then
  echo "No .app found under ${DERIVED_DATA:-unset}" | tee "$OUT/flow-error.txt"
  exit 1
fi
echo "app: $APP"

echo "==> Install and launch"
xcrun simctl install "$UDID" "$APP"
xcrun simctl terminate "$UDID" "$BUNDLE_ID" >/dev/null 2>&1 || true
xcrun simctl launch "$UDID" "$BUNDLE_ID" >/dev/null
sleep 3

shot() {
  local name="$1"
  xcrun simctl io "$UDID" screenshot "$OUT/screenshots/${name}.png" >/dev/null
  echo "screenshot: $OUT/screenshots/${name}.png"
}

if ! command -v maestro >/dev/null 2>&1; then
  echo "==> Install Maestro"
  curl -Ls "https://get.maestro.mobile.dev" | bash
  export PATH="$HOME/.maestro/bin:$PATH"
fi
command -v maestro >/dev/null 2>&1 || { echo "maestro is not on PATH" | tee "$OUT/flow-error.txt"; exit 1; }

shot "01-home"

FLOW="$OUT/maestro/store-shots.yaml"
cat > "$FLOW" << YAML
appId: ${BUNDLE_ID}
---
- extendedWaitUntil:
    visible:
      id: "home-screen"
    timeout: 20000
- takeScreenshot: 01-home
- scrollUntilVisible:
    element:
      id: "progress-section"
    direction: DOWN
    timeout: 15000
- takeScreenshot: 02-progress
- tapOn:
    id: "calendar-day-1"
- extendedWaitUntil:
    visible:
      id: "workout-card"
    timeout: 10000
- takeScreenshot: 03-workout
- tapOn:
    id: "unlock-pro"
- extendedWaitUntil:
    visible:
      id: "paywall-screen"
    timeout: 10000
- takeScreenshot: 04-paywall
- tapOn:
    id: "paywall-close"
YAML

set +e
maestro test --output "$OUT/maestro" "$FLOW" | tee "$OUT/maestro.log"
RC=${PIPESTATUS[0]}
set -e

# Always grab the current screen as a fallback still.
shot "05-current"

# Copy any Maestro screenshots into $OUT/screenshots
if [[ -d "$OUT/maestro" ]]; then
  find "$OUT/maestro" -type f \( -name '*.png' -o -name '*.jpg' \) -print
fi

{
  echo "# 45 Days Abs Challenge Simulator QA"
  echo
  echo "maestro exit: $RC"
  echo
  echo "Stable testIDs: home-screen, progress-section, calendar-grid, calendar-day-1..45,"
  echo "workout-card, unlock-pro, paywall-screen, paywall-monthly, paywall-yearly,"
  echo "paywall-lifetime, paywall-restore, paywall-terms, paywall-privacy."
} | tee "$OUT/summary.md"

exit $RC
