# Proof QA Automation Suite

A professional-grade test automation framework demonstrating Senior QA Engineer competencies aligned with Proof's platform requirements.

**Test Site:** [The Internet](https://the-internet.herokuapp.com) — a purpose-built automation testing playground that mirrors Proof's critical flows: authentication, secure sessions, document handling, dynamic content, and dialog confirmations.

---

## What This Demonstrates

| Proof JD Requirement | Implementation |
|---|---|
| Test strategy & planning | Smoke → Regression → Full regression pipeline layers |
| Automated test frameworks | WebdriverIO (WDIO) + Playwright dual-framework |
| Complex distributed system validation | Multi-suite E2E covering auth, dynamic UI, file upload, alerts |
| CI/CD pipeline integration | GitHub Actions with 6-job parallel pipeline |
| Cross-browser & device testing | Playwright matrix (Chrome/FF/Safari) + BrowserStack config |
| Performance & load testing | Custom concurrent-user load runner with SLA thresholds |
| API testing | REST API tests via Jest + Axios against httpbin.org |
| Regression ownership | Dedicated regression suite + nightly CD schedule |
| Allure reporting & metrics | Built-in Allure integration across all test types |
| TypeScript / Node.js | Strict TypeScript throughout |

---

## Tech Stack

```
Testing Frameworks   WebdriverIO 8, Playwright 1.40
Language             TypeScript (strict)
Test Runners         WDIO Jasmine, Jest (API), Playwright Test
CI/CD                GitHub Actions
Cross-browser        BrowserStack (cloud), Playwright (local)
Reporting            Allure
API Testing          Jest + Axios
Performance          Custom Node.js runner
```

---

## Project Structure

```
proof-qa-automation/
│
├── .github/
│   └── workflows/
│       ├── ci.yml                     # PR validation pipeline (6 parallel jobs)
│       └── cd.yml                     # Full regression on main + BrowserStack
│
├── tests/                             # ← All test files, flat at root
│   ├── auth.spec.ts                   # Auth regression (20+ cases, WDIO)
│   ├── cross-browser.spec.ts          # Multi-browser + mobile (Playwright)
│   ├── load.test.ts                   # Performance / concurrent load runner
│   └── transactions.api.spec.ts       # REST API tests (Jest + Axios)
│
├── src/
│   ├── config/
│   │   ├── base.conf.ts               # Shared base configuration
│   │   ├── environment.ts             # Environment config (local/staging/prod)
│   │   ├── wdio.conf.ts               # WebdriverIO local runner → specs: tests/**
│   │   └── wdio.browserstack.conf.ts  # BrowserStack cross-browser config
│   │
│   ├── pages/                         # Page Object Model (POM)
│   │   ├── BasePage.ts                # Abstract base with shared helpers
│   │   ├── LoginPage.ts               # Authentication flows
│   │   ├── SecureAreaPage.ts          # Post-auth secure zone
│   │   ├── DynamicContentPage.ts      # Async/real-time content
│   │   ├── FileUploadPage.ts          # Document upload
│   │   └── AlertsPage.ts              # Browser dialogs / confirmations
│   │
│   └── utils/
│       ├── TestDataFactory.ts         # Centralized test data generation
│       └── Logger.ts                  # Structured logging (console + file)
│
├── setup-git.sh                       # ← Root-level git init + branch setup script
├── .env.example                       # Environment variable template
├── .eslintrc.js
├── .gitignore
├── jest.config.ts                     # Jest config → testMatch: tests/*.api.spec.ts
├── package.json
├── playwright.config.ts               # Playwright → testDir: ./tests
├── README.md
└── tsconfig.json                      # rootDir: "." to cover both src/ and tests/
```

---

## Quick Start

### Prerequisites

- Node.js >= 18
- Chrome (for local WDIO runs)
- Java 17+ (for Allure report generation)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/proof-qa-automation.git
cd proof-qa-automation
npm ci
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values (defaults work out of the box)
```

### 3. Run Tests

```bash
# Smoke tests (fastest — run first)
npm run test:smoke

# Full E2E regression
npm run test:regression

# Cross-browser with Playwright
npm run test:playwright

# API tests
npm run test:api

# Performance / load tests
npm run test:performance

# Generate and open Allure report
npm run report
```

---

## Git Setup & Branch Strategy

Run the setup script to initialize the repo with the correct branch structure:

```bash
chmod +x setup-git.sh

# Without remote (local only)
./setup-git.sh

# With GitHub remote
./setup-git.sh https://github.com/your-org/proof-qa-automation.git
```

This creates:

| Branch | Purpose |
|---|---|
| `main` | Production baseline. Protected. CD pipeline runs here. |
| `feature/ci-cd-pipeline` | Feature branch. CI pipeline triggers on push/PR. |

### Branch Workflow

```
feature/your-feature  →  PR to main  →  CI runs (lint + smoke + API + Playwright + perf)
                                     →  Review & merge
main                               →  CD runs (full regression + BrowserStack + mobile)
```

### Branch Protection Rules (recommended GitHub settings)

- Require PR before merging to `main`
- Require CI status checks to pass: `lint-typecheck`, `smoke-tests`, `api-tests`
- Dismiss stale approvals on new commits
- Require linear history

---

## CI/CD Pipeline

### CI (`.github/workflows/ci.yml`) — Triggered on PRs

```
PR opened/updated
│
├── 🔍 lint-typecheck          (ESLint + tsc)
│       │
│       ├── 🔥 smoke-tests     (WDIO, Chrome headless)
│       │       │
│       │       ├── 🎭 e2e-playwright  [chromium / firefox / webkit]  (parallel matrix)
│       │       └── ⚡ performance-tests
│       │
│       └── 🔌 api-tests       (Jest + Axios)
│
└── 📊 generate-report         (Allure merge + PR comment)
```

### CD (`.github/workflows/cd.yml`) — Triggered on merge to `main`

```
Push to main / nightly cron / manual dispatch
│
├── 🔁 full-regression         (complete WDIO suite)
│       │
│       ├── 🌐 browserstack    (Chrome/Firefox/Safari on real devices)
│       └── 📱 mobile-tests    (Pixel 5, iPhone 14 via Playwright)
│
└── 🚦 quality-gate            (blocks deploy on failure + Slack alert)
```

---

## Required GitHub Secrets

| Secret | Description |
|---|---|
| `BASE_URL` | Staging/prod URL to test against |
| `BROWSERSTACK_USERNAME` | BrowserStack username |
| `BROWSERSTACK_ACCESS_KEY` | BrowserStack access key |
| `SLACK_WEBHOOK_URL` | Slack webhook for failure alerts |

---

## Test Site: The Internet

**URL:** https://the-internet.herokuapp.com

| Feature Used | Proof Equivalent |
|---|---|
| `/login` | Identity verification entry point |
| `/secure` | Post-auth protected transaction area |
| `/dynamic_content` | Real-time transaction status / signing queues |
| `/upload` | Legal document upload (deeds, wills, mortgages) |
| `/javascript_alerts` | Transaction confirmation dialogs |

---

## Reporting

After any test run:

```bash
# Generate and open report locally
npm run report

# CI-only (generates without opening browser)
npm run report:ci
```

Allure reports are automatically uploaded as GitHub Actions artifacts and retained for 30 days on main, 7 days on PRs.

---

## Quality Metrics Tracked

- **Test pass rate** per suite and per browser
- **SLA compliance** — all API calls < 1.5s, page loads < 3s
- **Coverage** — API tests report code coverage via Jest
- **Failure trends** — Allure history tracking across runs
- **Cross-browser parity** — any divergence between browsers is a blocking defect