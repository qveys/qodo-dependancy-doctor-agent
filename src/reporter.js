function generateReport(dependencies, prUrl = null) {
    const critical = dependencies.filter(d => d.risk === 'critical' || d.risk === 'high').length;
    const report = {
      content: `
  # Rapport Dependency Doctor
  
  ## 📦 Dépendances à mettre à jour (${dependencies.length} issues)
  | Package   | Version Actuelle | Version Cible | Risque   | Recommandation          |
  |-----------|------------------|---------------|----------|-------------------------|
  ${dependencies.map(d => `| ${d.name} | ${d.current} | ${d.wanted} | ${d.risk} | ${d.recommendation} |`).join('\n')}
  
  ## 📊 Résumé
  - **Problèmes critiques** : ${critical}
  - **Pull Request** : ${prUrl ? `[Lien](${prUrl})` : 'Aucune'}
  
  ## 🔧 Prochaines étapes
  - Revoyez les dépendances à risque **critical/high**.
  - Exécutez \`npm test\` après toute mise à jour.
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
  