const { execSync } = require('child_process');
const semver = require('semver');

async function scanDependencies(path) {
  try {
    const pkg = require(path);
    const dir = path.replace('/package.json', '');
    const outdated = JSON.parse(execSync(`cd ${dir} && npm outdated --json`).toString());
    const auditRaw = execSync(`cd ${dir} && npm audit --json`).toString();
    const audit = auditRaw ? JSON.parse(auditRaw) : { advisories: {} };

    const dependencies = [];
    for (const [name, info] of Object.entries(outdated)) {
      dependencies.push({
        name,
        current: info.current,
        wanted: info.wanted,
        latest: info.latest,
        risk: getRiskLevel(name, audit),
        recommendation: getRecommendation(info),
      });
    }
    return dependencies;
  } catch (error) {
    console.error(`Erreur lors du scan : ${error.message}`);
    return [];
  }
}

function getRiskLevel(name, audit) {
  const issues = audit?.advisories || {};
  for (const [, advisory] of Object.entries(issues)) {
    if (advisory.modules?.some(m => m.startsWith(name))) {
      return advisory.severity;
    }
  }
  return 'low';
}

function getRecommendation(info) {
  if (info.wanted !== info.latest) {
    return `Mettre à jour vers ${info.wanted} (compatibilité) ou ${info.latest} (dernière version).`;
  }
  return 'Aucune action requise.';
}

module.exports = { scanDependencies };
