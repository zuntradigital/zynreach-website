#!/usr/bin/env bash
set -euo pipefail

# Atomic build-then-swap production deploy for zynreach-website.
#
# WHY THIS SCRIPT EXISTS
# -----------------------
# The old deploy pattern on a self-hosted Node.js box (Hostinger or
# otherwise) is usually: pull new code, run `npm run build` IN PLACE, then
# restart the process — all inside the one directory the live server is
# already reading from. That has a race window: the instant `next build`
# starts deleting/replacing files under `.next/static/`, any request the
# STILL-RUNNING old process serves (using its already-loaded, in-memory
# route manifest) can ask for a chunk file the build already removed —
# producing a 404 for a JS/CSS chunk mid-request. This is exactly the
# "some chunks 404, others don't, and it's different chunks every time"
# symptom this deploy pattern was written to eliminate. It's a real
# Next.js production hazard, documented under "version skew" in
# node_modules/next/dist/docs/01-app/02-guides/self-hosting.md.
#
# This script closes that window entirely: every deploy builds into a
# brand-new, isolated release directory that nothing is serving yet, and
# only swaps a `current` symlink to point at it — a single atomic
# filesystem rename — once the build has 100% finished. PM2 then reloads
# workers one at a time against the new `current/ecosystem.config.js`
# (zero-downtime), so no worker is ever pointed at a half-written build.
# next.config.ts's `deploymentId` (pinned to the deployed commit SHA)
# additionally covers the case an old client's tab is still open across a
# real rollout to a new commit — Next's own client runtime detects the
# mismatch and forces a full reload instead of a broken partial one.
#
# LAYOUT THIS SCRIPT MANAGES (all under APP_ROOT, see below):
#   releases/<timestamp>-<short-sha>/   one full checkout + build per deploy
#   current -> releases/<...>/          atomically repointed each deploy
#
# WHERE TO PUT THIS SCRIPT
# -------------------------
# Keep ONE stable copy of this file outside the release rotation above —
# e.g. ~/deploy/deploy.sh on the server — since it has to keep running
# across the exact symlink-swap it performs; a copy living inside
# `current` would be swapped out from under itself mid-run. The copy
# checked into this git repo (scripts/deploy.sh) is for review/history —
# copy it to that stable path (and re-copy after any change here) rather
# than invoking it from inside a release.
#
# USAGE
#   APP_ROOT=/home/<user>/apps/zynreach-website ./deploy.sh [git-ref]
#   git-ref defaults to "main".
#
# APP_ROOT must exist and be writable; this script creates
# releases/ and current under it. Requires: git, node, npm, pm2 on PATH.

REPO_URL="${ZYNREACH_WEBSITE_REPO_URL:-https://github.com/zuntradigital/zynreach-website.git}"
GIT_REF="${1:-main}"
APP_ROOT="${APP_ROOT:?Set APP_ROOT to the stable directory that holds releases/ and current (e.g. /home/<user>/apps/zynreach-website)}"
RELEASES_DIR="$APP_ROOT/releases"
CURRENT_LINK="$APP_ROOT/current"
KEEP_RELEASES="${KEEP_RELEASES:-3}"

mkdir -p "$RELEASES_DIR"

echo "==> Cloning $GIT_REF from $REPO_URL"
TMP_CLONE="$(mktemp -d)"
git clone --quiet --depth 1 --branch "$GIT_REF" "$REPO_URL" "$TMP_CLONE"
COMMIT_SHA="$(git -C "$TMP_CLONE" rev-parse HEAD)"
TIMESTAMP="$(date -u +%Y%m%d%H%M%S)"
RELEASE_DIR="$RELEASES_DIR/${TIMESTAMP}-${COMMIT_SHA:0:12}"
mv "$TMP_CLONE" "$RELEASE_DIR"

echo "==> Building release $RELEASE_DIR (commit $COMMIT_SHA)"
cd "$RELEASE_DIR"

# Explicit so it's visible in this script's own log output; also matches
# what next.config.ts would derive itself from `.git` in this checkout if
# this were left unset, so setting it here is a belt-and-suspenders
# measure, not a divergent source of truth.
export NEXT_DEPLOYMENT_ID="$COMMIT_SHA"

npm ci
npm run build

echo "==> Build complete. Swapping 'current' -> $RELEASE_DIR"
ln -sfn "$RELEASE_DIR" "$CURRENT_LINK.tmp"
mv -Tf "$CURRENT_LINK.tmp" "$CURRENT_LINK"

echo "==> Reloading PM2 against the new release (zero-downtime)"
if pm2 describe zynreach-website > /dev/null 2>&1; then
  pm2 reload "$CURRENT_LINK/ecosystem.config.js" --update-env
else
  pm2 start "$CURRENT_LINK/ecosystem.config.js"
fi
pm2 save

echo "==> Pruning old releases (keeping last $KEEP_RELEASES)"
ls -1dt "$RELEASES_DIR"/*/ 2>/dev/null | tail -n "+$((KEEP_RELEASES + 1))" | xargs -r rm -rf

echo "==> Deployed $COMMIT_SHA successfully. Live at $CURRENT_LINK"
