# 🤖 GitHub Actions CI/CD Documentation

This document describes the GitHub Actions workflows configured for the Camila Services Dashboard project.

## 📋 Table of Contents

- [Workflows Overview](#workflows-overview)
- [Workflow Details](#workflow-details)
- [Dependabot Configuration](#dependabot-configuration)
- [Secrets Configuration](#secrets-configuration)
- [Branch Protection Rules](#branch-protection-rules)
- [Troubleshooting](#troubleshooting)

## 🔄 Workflows Overview

### Active Workflows

| Workflow | Trigger | Purpose | Duration |
|----------|---------|---------|----------|
| **🔍 Lint** | Push, PR | Code quality checks (ESLint, TypeScript) | ~2 min |
| **🧪 Test** | Push, PR | Unit & E2E tests with coverage | ~5 min |
| **🏗️ Build & Package** | Push, PR, Release | Build app & Docker image | ~8 min |
| **🚀 CI/CD Pipeline** | Push, PR, Manual | Orchestrates all workflows | ~15 min |
| **🔒 Security Audit** | Schedule, PR | Security scanning & audit | ~3 min |

### Workflow Triggers

```yaml
# Automatic triggers
- push to main/develop branches
- pull_request to main/develop branches
- release published
- schedule (security audit: weekly)

# Manual trigger
- workflow_dispatch (CI/CD Pipeline)
```

## 📖 Workflow Details

### 1. 🔍 Lint Workflow

**File:** `.github/workflows/lint.yml`

**Purpose:** Ensures code quality and type safety.

**Steps:**
1. Checkout repository
2. Setup Node.js 20 with npm cache
3. Install dependencies
4. Run ESLint
5. Run TypeScript type checking

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Only when files in `camila-product-react-ui/` change

**Example:**
```bash
# Locally replicate this workflow
cd camila-product-react-ui
npm run lint
npx tsc --noEmit
```

---

### 2. 🧪 Test Workflow

**File:** `.github/workflows/test.yml`

**Purpose:** Runs unit, integration, and end-to-end tests.

**Jobs:**

#### Unit Tests
- Runs Vitest test suite
- Generates coverage report
- Uploads coverage to Codecov
- Coverage threshold: 80%

#### E2E Tests
- Installs Playwright browsers
- Builds application
- Runs E2E test suite
- Uploads test reports as artifacts

**Artifacts:**
- `playwright-report-{sha}`: Interactive HTML report (7 days)
- `test-results-{sha}`: Raw test results (7 days)
- `coverage`: Code coverage reports

**Example:**
```bash
# Locally replicate this workflow
cd camila-product-react-ui
npm run test:run
npm run test:coverage
npm run test:e2e
```

---

### 3. 🏗️ Build & Package Workflow

**File:** `.github/workflows/build.yml`

**Purpose:** Builds the React application and creates Docker images.

**Jobs:**

#### Build App
- Builds production bundle with Vite
- Generates build size report
- Uploads build artifacts

#### Build Docker
- Multi-platform build (amd64, arm64)
- Pushes to GitHub Container Registry (ghcr.io)
- Uses build cache for faster builds
- Tags: `latest`, `{branch}`, `{sha}`, `{version}`

#### Test Docker
- Pulls built image
- Runs container
- Performs health checks
- Tests HTTP endpoint

**Registry:** `ghcr.io/{owner}/{repo}`

**Example:**
```bash
# Locally replicate this workflow
cd camila-product-react-ui
npm run build
npm run docker:build
```

**Image Tags:**
```
ghcr.io/juanpablojimenezesclusa/camila-services-dashboard:latest
ghcr.io/juanpablojimenezesclusa/camila-services-dashboard:develop
ghcr.io/juanpablojimenezesclusa/camila-services-dashboard:v1.0.0
ghcr.io/juanpablojimenezesclusa/camila-services-dashboard:main-abc123
```

---

### 4. 🚀 CI/CD Pipeline

**File:** `.github/workflows/ci.yml`

**Purpose:** Orchestrates all workflows in the correct order.

**Execution Order:**
```
1. Lint (parallel)
2. Test (parallel)
   ↓
3. Build (after lint & test pass)
   ↓
4. CI Success (summary)
```

**Features:**
- Reuses existing workflows
- Provides unified status check
- Generates summary report
- Can be triggered manually via GitHub UI

---

### 5. 🔒 Security Audit

**File:** `.github/workflows/security.yml`

**Purpose:** Identifies security vulnerabilities and code quality issues.

**Jobs:**

#### NPM Audit
- Runs `npm audit`
- Checks for known vulnerabilities
- Reports moderate+ severity issues

#### Dependency Review
- Analyzes dependency changes in PRs
- Identifies vulnerable dependencies
- Blocks PRs with high-severity issues

#### CodeQL Analysis
- JavaScript/TypeScript code scanning
- Security vulnerability detection
- Code quality analysis
- Results published to Security tab

**Schedule:** Every Monday at 9:00 AM UTC

**Example:**
```bash
# Locally replicate npm audit
cd camila-product-react-ui
npm audit --audit-level=moderate
```

---

## 🤖 Dependabot Configuration

**File:** `.github/dependabot.yml`

**Purpose:** Automated dependency updates with intelligent grouping.

### Update Schedules

| Ecosystem | Schedule | Day | Time | Groups |
|-----------|----------|-----|------|--------|
| **npm** | Weekly | Monday | 09:00 | Production, Development, Tooling |
| **Docker** | Weekly | Monday | 10:00 | Docker Images |
| **GitHub Actions** | Weekly | Monday | 11:00 | All Actions |

### Dependency Groups

#### 1. Node.js Production Dependencies
```yaml
Group: node-production
Packages:
  - react*
  - axios, graphql*, grpc-*, rsocket-*
  - chart.js, i18next, oidc-client-ts
  - react-router-dom, protobufjs
Update types: minor, patch
```

#### 2. Node.js Development Dependencies
```yaml
Group: node-development
Packages:
  - @types/*, @testing-library/*
  - vitest, playwright, eslint*
  - typescript*, vite*, @vitejs/*
Update types: minor, patch
```

#### 3. Node.js Tooling
```yaml
Group: node-tooling
Packages:
  - @openapitools/*, grpc-tools, globals
Update types: minor, patch
```

#### 4. Docker Images
```yaml
Group: docker-images
Packages:
  - node, nginx
Update types: minor, patch
Ignored: major versions
```

#### 5. GitHub Actions
```yaml
Group: github-actions
Packages: All actions
Update types: minor, patch
```

### Dependabot PR Labels

- `dependencies`: All dependency updates
- `npm`: Node.js dependencies
- `docker`: Docker base images
- `github-actions`: GitHub Actions updates
- `automated`: Auto-generated PRs

### Ignored Updates

Major version updates for:
- `react` (requires manual migration)
- `node` (requires testing)
- `nginx` (requires config review)

---

## 🔐 Secrets Configuration

### Required Secrets

**GitHub Container Registry:**
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions
- No manual configuration needed

**Optional Secrets:**

**Codecov (for test coverage):**
```bash
# Repository Settings → Secrets → Actions → New repository secret
Name: CODECOV_TOKEN
Value: <your-codecov-token>
```

**Custom Docker Registry:**
```bash
# If using Docker Hub or custom registry
DOCKER_USERNAME: <username>
DOCKER_PASSWORD: <password>
DOCKER_REGISTRY: <registry-url>
```

### Setting Secrets

1. Navigate to repository settings
2. Go to **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add name and value
5. Click **Add secret**

---

## 🛡️ Branch Protection Rules

### Recommended Settings

#### For `main` branch:

```yaml
Required status checks:
  ✅ Lint / ESLint & Type Check
  ✅ Test / Unit & Integration Tests
  ✅ Test / End-to-End Tests
  ✅ Build / Build React Application
  ✅ CodeQL

Settings:
  ✅ Require branches to be up to date before merging
  ✅ Require pull request before merging
  ✅ Require approvals: 1
  ✅ Dismiss stale reviews when new commits are pushed
  ✅ Require review from Code Owners
  ✅ Require status checks to pass before merging
  ✅ Require conversation resolution before merging
  ✅ Include administrators
  ❌ Allow force pushes
  ❌ Allow deletions
```

#### For `develop` branch:

```yaml
Required status checks:
  ✅ Lint / ESLint & Type Check
  ✅ Test / Unit & Integration Tests
  ✅ Build / Build React Application

Settings:
  ✅ Require pull request before merging
  ✅ Require status checks to pass before merging
  ✅ Require branches to be up to date before merging
  ❌ Require approvals (optional for develop)
  ❌ Include administrators (allow admin bypass)
```

### Configuring Branch Protection

1. Go to **Settings** → **Branches**
2. Click **Add rule**
3. Enter branch name pattern (e.g., `main`)
4. Select protection rules
5. Click **Create** or **Save changes**

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Lint Workflow Fails

**Error:** ESLint errors or TypeScript compilation errors

**Solutions:**
```bash
# Fix linting issues locally
npm run lint:fix

# Check TypeScript errors
npx tsc --noEmit

# Ensure dependencies are up to date
npm install
```

---

#### 2. Test Workflow Fails

**Error:** Tests failing or timeout

**Solutions:**
```bash
# Run tests locally
npm run test:run

# Run E2E tests with UI
npm run test:e2e:ui

# Check for flaky tests
npm run test:e2e -- --repeat-each=3
```

---

#### 3. Docker Build Fails

**Error:** Docker build timeout or out of memory

**Solutions:**
```yaml
# Increase timeout in workflow
timeout-minutes: 30

# Reduce platforms (remove arm64 for faster builds)
platforms: linux/amd64
```

---

#### 4. NPM Audit Fails

**Error:** High/critical vulnerabilities found

**Solutions:**
```bash
# Review vulnerabilities
npm audit

# Update specific package
npm update package-name

# Force update (if safe)
npm audit fix --force

# Create exceptions in workflow if false positive
run: npm audit --audit-level=critical
```

---

#### 5. Dependabot PRs Not Merging

**Issue:** Dependabot PRs stuck or not auto-merging

**Solutions:**
1. Enable auto-merge: `@dependabot merge`
2. Check branch protection rules
3. Ensure all status checks pass
4. Review Dependabot settings

---

#### 6. GitHub Actions Quota Exceeded

**Error:** "No more minutes available"

**Solutions:**
- Optimize workflows (use caching)
- Reduce unnecessary workflow runs
- Use `concurrency` to cancel duplicate runs
- Consider GitHub Actions limits for private repos

---

## 📊 Monitoring & Insights

### View Workflow Runs

1. Go to **Actions** tab in repository
2. Select workflow from left sidebar
3. Click on specific run to see details

### Workflow Badges

Add badges to README:

```markdown
![Lint](https://github.com/{owner}/{repo}/workflows/Lint/badge.svg)
![Test](https://github.com/{owner}/{repo}/workflows/Test/badge.svg)
![Build](https://github.com/{owner}/{repo}/workflows/Build%20%26%20Package/badge.svg)
```

### Artifacts

Access build artifacts:
1. Go to workflow run
2. Scroll to **Artifacts** section
3. Download artifact (available for 7 days)

---

## 🚀 Best Practices

### For Contributors

1. **Run checks locally** before pushing
   ```bash
   npm run lint
   npm run test:run
   npm run build
   ```

2. **Keep PRs small** - easier to review and test

3. **Write tests** for new features and bug fixes

4. **Update documentation** when changing functionality

5. **Use conventional commits** for clear history
   ```
   feat: add new feature
   fix: resolve bug
   docs: update readme
   test: add missing tests
   ```

### For Maintainers

1. **Review Dependabot PRs weekly**
2. **Monitor security alerts** in Security tab
3. **Keep workflows updated** with latest actions versions
4. **Review failed workflows** promptly
5. **Update branch protection** as needed

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

---

<div align="center">

**[⬆ Back to Top](#-github-actions-cicd-documentation)**

Last Updated: February 2026

</div>
