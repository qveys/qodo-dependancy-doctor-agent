function generateReport(dependencies, prUrl = null) {
    const critical = dependencies.filter(d => d.risk === 'critical' || d.risk === 'high').length;
    const report = {
      content: `
  # Dependency Doctor Report
  
  ## 📦 Dependencies to update (${dependencies.length} issues)
  | Package   | Current Version | Target Version | Risk   | Recommendation          |
  |-----------|------------------|---------------|----------|-------------------------|
  ${dependencies.map(d => `| ${d.name} | ${d.current} | ${d.wanted} | ${d.risk} | ${d.recommendation} |`).join('\n')}
  
  ## 📊 Summary
  - **Critical issues** : ${critical}
  - **Pull Request** : ${prUrl ? `[Link](${prUrl})` : 'None'}
  
  ## 🔧 Next Steps
  - Review dependencies with **critical/high** risk.
  - Run \`npm test\` after any updates.
  `,
      summary: {
        total_issues: dependencies.length,
        critical_issues: critical,
        pr_created: !!prUrl,
        pr_url: prUrl,
      }
    };
    return report;
  }
  
  module.exports = { generateReport };
  