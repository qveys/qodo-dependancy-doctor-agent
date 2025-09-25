# AGENTS.md

## Repository Guidelines

### Project Structure & Module Organization

The codebase is organized into clear functional modules:

- `src/` - Main application code with modular components (scanner, reporter, GitHub integration)
- `test/` - Test files and test fixtures with outdated dependencies for testing
- `agent.toml` - Qodo agent configuration and metadata
- `.github/workflows/` - CI/CD automation workflows for scheduled dependency checks

### Build, Test, and Development Commands

```bash
## Install dependencies
npm install

## Run the agent locally (requires Qodo CLI)
npm install -g @qodo/command
qodo --agent-file=./agent.toml --path ./test/package.json

## Run with auto-fix enabled
qodo --agent-file=./agent.toml --path ./test/package.json --auto-fix true --github-token=YOUR_TOKEN

## Dry run (simulation mode)
qodo --agent-file=./agent.toml --path ./test/package.json --dry-run true
```

### Coding Style & Naming Conventions

- **Indentation**: 2 spaces (JavaScript standard)
- **File naming**: kebab-case for directories, camelCase for JavaScript files
- **Function naming**: camelCase with descriptive names (e.g., `scanDependencies`, `generateReport`)
- **Module exports**: CommonJS format with destructured exports
- **Error handling**: Try-catch blocks with meaningful error messages

### Testing Guidelines

- **Framework**: Basic Node.js testing (no formal framework currently configured)
- **Test files**: Located in `test/` directory with `.test.js` suffix
- **Test fixtures**: Sample `package.json` files with outdated dependencies
- **Running tests**: Currently manual execution of test files

### Commit & Pull Request Guidelines

- **Commit format**: Conventional commits with emoji prefixes
  - `✨ feat:` for new features
  - `🔧 fix:` for bug fixes  
  - `📝 docs:` for documentation
  - `🎉 feat:` for initial features
- **PR process**: Automated PR creation via the agent itself
- **Branch naming**: `chore/deps-update-{timestamp}` for dependency updates

---

## Repository Tour

### 🎯 What This Repository Does

Dependency Doctor is a Qodo agent that automatically scans, evaluates, and fixes outdated or vulnerable Node.js dependencies in projects.

**Key responsibilities:**

- Scan package.json files for outdated dependencies using npm outdated and npm audit
- Classify security risks by severity (critical/high/medium/low)
- Generate comprehensive Markdown reports with actionable recommendations
- Automatically create Pull Requests with dependency updates when enabled

---

### 🏗️ Architecture Overview

#### System Context

```text
[User/CI] → [Qodo CLI] → [Dependency Doctor Agent] → [npm commands] → [GitHub API]
                              ↓
                         [Markdown Report]
```

#### Key Components

- **Scanner** (`src/scanner.js`) - Executes npm commands and parses dependency information
- **Reporter** (`src/reporter.js`) - Generates structured Markdown reports with risk analysis
- **GitHub Integration** (`src/github.js`) - Creates Pull Requests using Octokit REST API
- **Main Orchestrator** (`src/index.js`) - Coordinates the entire workflow and handles CLI arguments

#### Data Flow

1. Agent receives package.json path and configuration arguments via Qodo CLI
2. Scanner executes `npm outdated` and `npm audit` commands to gather dependency data
3. Risk assessment is performed by cross-referencing audit results with outdated packages
4. Reporter generates a structured Markdown report with recommendations
5. If auto-fix is enabled, updates are applied and a PR is created via GitHub API

---

### 📁 Project Structure [Partial Directory Tree]

```text
qodo-dependancy-doctor-agent/
├── src/                       ## Main application code
│   ├── index.js              ## Main orchestrator and workflow coordinator
│   ├── scanner.js            ## npm command execution and dependency analysis
│   ├── reporter.js           ## Markdown report generation
│   └── github.js             ## GitHub API integration for PR creation
├── test/                     ## Test files and fixtures
│   ├── scanner.test.js       ## Unit tests for dependency scanning
│   ├── package.json          ## Test fixture with outdated dependencies
│   └── package.jsonc         ## Additional test fixture
├── .github/workflows/        ## CI/CD automation
│   └── dependancy-doctor.yml ## Weekly scheduled dependency checks
├── agent.toml               ## Qodo agent configuration and metadata
├── package.json             ## Project dependencies and metadata
└── README.md               ## User documentation and usage examples
```

#### Key Files to Know

| File | Purpose | When You'd Touch It |
|------|---------|---------------------|
| `src/index.js` | Main workflow orchestrator | Adding new features or modifying the core flow |
| `src/scanner.js` | npm command execution and parsing | Changing how dependencies are analyzed |
| `src/reporter.js` | Report generation and formatting | Modifying output format or adding new metrics |
| `src/github.js` | GitHub API integration | Changing PR creation logic or GitHub interactions |
| `agent.toml` | Qodo agent configuration | Updating agent metadata, arguments, or tools |
| `test/package.json` | Test fixture with outdated deps | Testing scanner functionality |
| `.github/workflows/dependancy-doctor.yml` | CI/CD automation | Modifying scheduled runs or workflow triggers |

---

### 🔧 Technology Stack

#### Core Technologies

- **Language:** JavaScript (Node.js) - Chosen for npm ecosystem integration and GitHub Actions compatibility
- **Runtime:** Node.js - Required for executing npm commands and accessing the npm registry
- **Agent Framework:** Qodo CLI - Provides structured agent execution and argument handling

#### Key Libraries

- **@octokit/rest** - GitHub REST API client for automated PR creation
- **@actions/core** - GitHub Actions utilities for CI/CD integration
- **@actions/github** - GitHub Actions context and helper functions
- **axios** - HTTP client for external API calls
- **semver** - Semantic versioning utilities for dependency comparison

#### Development Tools

- **npm** - Package manager and dependency analysis tool
- **git** - Version control for branch management and PR creation
- **GitHub Actions** - CI/CD automation for scheduled dependency checks

---

### 🌐 External Dependencies

#### Required Services

- **npm Registry** - Source of dependency information and vulnerability data
- **GitHub API** - Required for automated PR creation when auto-fix is enabled
- **Qodo CLI** - Agent execution environment and argument parsing

#### Optional Integrations

- **GitHub Actions** - Automated scheduling via workflows (weekly dependency checks)
- **CI/CD Systems** - Can be integrated into any CI/CD pipeline supporting Node.js

---

#### Environment Variables

```bash
## Required for PR creation
GITHUB_TOKEN=              ## GitHub token for API access
GITHUB_REPOSITORY=         ## Repository in format owner/repo

## Optional
NODE_ENV=                  ## Environment (development/production)
```

---

### 🔄 Common Workflows

#### Dependency Scanning Workflow

1. Agent receives package.json path and configuration via Qodo CLI
2. Scanner executes `npm outdated --json` to identify outdated packages
3. Scanner runs `npm audit --json` to gather security vulnerability data
4. Risk assessment combines outdated status with security advisory information
5. Reporter generates structured Markdown output with recommendations

**Code path:** `index.js` → `scanner.js` → `reporter.js`

#### Auto-Fix Workflow (with PR Creation)

1. Standard scanning workflow executes first
2. If auto-fix enabled and GitHub token provided, creates new branch
3. Executes `npm update` to update dependencies within semver constraints
4. Commits changes with conventional commit message
5. Creates Pull Request via GitHub API with generated report as description

**Code path:** `index.js` → `scanner.js` → `reporter.js` → `github.js`

---

### 📈 Performance & Scale

#### Performance Considerations

- **npm command execution** - Scanner handles npm command failures gracefully (outdated returns exit code 1)
- **Error resilience** - Audit failures (missing lockfile) don't break the workflow
- **Async operations** - GitHub API calls are properly awaited to prevent race conditions

#### Monitoring

- **Error logging** - Console error output for debugging npm command failures
- **Report metrics** - Structured summary data including issue counts and PR status

---

### 🚨 Things to Be Careful About

#### 🔒 Security Considerations

- **GitHub tokens** - Requires proper token management for PR creation functionality
- **npm audit data** - Processes security vulnerability information from npm registry
- **Git operations** - Executes git commands that modify repository state when auto-fix is enabled

#### ⚠️ Operational Considerations

- **npm command dependencies** - Requires npm to be available in the execution environment
- **Git configuration** - Auto-fix mode sets global git user configuration
- **Branch management** - Creates timestamped branches that may accumulate over time
- **Lockfile handling** - npm audit requires package-lock.json; gracefully handles missing lockfiles

*Updated at: 2025-01-27 15:30:00 UTC*
