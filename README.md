# Dependency Doctor

A Qodo agent to automatically scan and fix outdated or vulnerable Node.js dependencies.

## 🚀 Features

- Detection of outdated/vulnerable dependencies
- Risk classification (critical/high/medium/low)
- Automatic Pull Request creation
- CI/CD integration (GitHub Actions)
- Comprehensive dependency audit reports
- Automated dependency updates with compatibility checks

## 📥 Installation

```bash
npm install -g @qodo/command
qodo --agent-file=https://raw.githubusercontent.com/qveys/qodo-dependency-doctor-agent/main/agent.toml
```

## 🛠️ Usage

```bash
# Scan dependencies in a project
qodo dependency-doctor --path ./package.json

# Auto-fix with PR creation
qodo dependency-doctor --path ./package.json --auto-fix true --github-token YOUR_TOKEN

# Dry run (simulation without changes)
qodo dependency-doctor --path ./package.json --dry-run true
```

## 📋 Arguments

- `path` (required): Path to package.json file
- `auto-fix` (optional): Automatically create PR with fixes (default: false)
- `dry-run` (optional): Simulate without applying changes (default: false)
- `github-token` (optional): GitHub token for PR creation

## 🔧 Dependencies

- `@actions/core`: GitHub Actions core utilities
- `@actions/github`: GitHub Actions toolkit
- `@octokit/rest`: GitHub REST API client
- `axios`: HTTP client
- `semver`: Semantic versioning utilities

## 🤖 Agent Configuration

The agent is configured via `agent.toml` and includes:

- Pre/post prompts for dependency management expertise
- Argument definitions and validation
- Output schema for structured reports
- Success conditions for automated workflows

## 📊 Output Format

The agent generates structured reports including:

- Dependency comparison table (current vs wanted vs latest)
- Risk assessment for each dependency
- Actionable recommendations
- Summary statistics
- PR creation status and links

## 🎬 Demo

[Link to your demo video]

## 🏆 Contest

This project participates in the #QodoAgentChallenge.
