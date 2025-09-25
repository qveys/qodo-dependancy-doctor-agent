const { scanDependencies } = require('./scanner');
const { generateReport } = require('./reporter');
const { createPullRequest } = require('./github');
const { execSync } = require('child_process');
const fs = require('fs');

async function main(args) {
  const { path, autoFix, dryRun, githubToken } = args;
  const dependencies = await scanDependencies(path);
  const report = generateReport(dependencies);

  if (autoFix && !dryRun && githubToken) {
    try {
      const branch = `chore/deps-update-${Date.now()}`;
      execSync(`cd ${path} && git checkout -b ${branch}`);
      execSync(`cd ${path} && npm update`);
      execSync(`cd ${path} && git add package.json package-lock.json`);
      execSync(`cd ${path} && git config --global user.email "dependency-doctor@example.com"`);
      execSync(`cd ${path} && git config --global user.name "Dependency Doctor"`);
      execSync(`cd ${path} && git commit -m "chore(deps): update dependencies"`);
      execSync(`cd ${path} && git push origin ${branch}`);
      const [owner, repo] = process.env.GITHUB_REPOSITORY?.split('/') || ['qveys', 'qodo-dependancy-doctor-agent'];
      const prUrl = await createPullRequest({
        token: githubToken,
        owner,
        repo,
        branch,
        base: 'main',
        title: 'chore(deps): update dependencies',
        body: report.content,
      });
      report.summary.pr_url = prUrl;
      report.summary.pr_created = true;
    } catch (error) {
      console.error(`Erreur lors de la création de la PR : ${error.message}`);
    }
  }
  return report;
}

module.exports = { main };
