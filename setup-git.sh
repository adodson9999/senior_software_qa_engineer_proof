#!/usr/bin/env bash
# ============================================================
# setup-git.sh
# One-time script to initialize the repo, create branch
# structure, and push to remote.
#
# Usage (run from project root):
#   chmod +x setup-git.sh
#   ./setup-git.sh <your-remote-url>
#
# Example:
#   ./setup-git.sh https://github.com/your-org/proof-qa-automation.git
# ============================================================

set -euo pipefail

REMOTE_URL=${1:-""}
REPO_NAME="proof-qa-automation"

echo "🚀 Initializing $REPO_NAME Git repository..."

# Initialize git
git init
git add .
git commit -m "chore: initial project scaffold — Proof QA Automation Suite

- WebdriverIO + Playwright dual framework setup
- Page Object Model for The Internet (https://the-internet.herokuapp.com)
- E2E tests: auth, dynamic content, file upload, alerts
- API tests against httpbin.org
- Performance/load test runner
- GitHub Actions CI pipeline (PR validation)
- GitHub Actions CD pipeline (full regression + BrowserStack)
- Allure reporting integration
- TypeScript strict mode throughout
- Cross-browser: Chrome, Firefox, Safari, Mobile"

# Rename default branch to main
git branch -M main

# Create and switch to feature branch
echo ""
echo "🌿 Creating feature/ci-cd-pipeline branch..."
git checkout -b feature/ci-cd-pipeline

git add .
git commit --allow-empty -m "ci: add GitHub Actions CI/CD workflows

- ci.yml: PR validation (lint, smoke, API, Playwright matrix, perf, Allure)
- cd.yml: Full regression on main (BrowserStack, mobile, quality gate, Slack)
- Concurrency controls to cancel stale runs
- Artifact retention for 30 days on main, 7 days on PRs
- PR comment with test summary table"

# Push to remote if URL provided
if [ -n "$REMOTE_URL" ]; then
  echo ""
  echo "🔗 Adding remote: $REMOTE_URL"
  git remote add origin "$REMOTE_URL"

  echo "📤 Pushing main branch..."
  git push -u origin main

  echo "📤 Pushing feature/ci-cd-pipeline branch..."
  git push -u origin feature/ci-cd-pipeline

  echo ""
  echo "✅ Done! Branches pushed:"
  echo "   main                    → production baseline"
  echo "   feature/ci-cd-pipeline  → open a PR to trigger CI"
else
  echo ""
  echo "⚠️  No remote URL provided. Branches created locally:"
  echo "   To add a remote later: git remote add origin <url>"
fi

echo ""
echo "📋 Branch summary:"
git branch -v
echo ""
echo "📋 Recent commits:"
git log --oneline -5
