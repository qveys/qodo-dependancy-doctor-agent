const { execSync } = require('child_process');

async function scanDependencies(path) {
  try {
    const dir = path.replace('/package.json', '');
    
    // npm outdated returns exit code 1 when there are outdated packages, but we still want the output
    let outdated = {};
    try {
      const outdatedOutput = execSync(`cd ${dir} && npm outdated --json`, { stdio: 'pipe' }).toString();
      outdated = JSON.parse(outdatedOutput);
    } catch (error) {
      // npm outdated returns exit code 1 when packages are outdated, but the output is still valid
      // The output is in error.stdout when using stdio: 'pipe'
      if (error.stdout && error.stdout.toString().trim()) {
        outdated = JSON.parse(error.stdout.toString());
      } else {
        // If no stdout or empty stdout, use empty object
        outdated = {};
      }
    }
    
    // npm audit requires a lockfile, so make it optional
    let audit = { advisories: {} };
    try {
      const auditRaw = execSync(`cd ${dir} && npm audit --json`, { stdio: 'pipe' }).toString();
      audit = auditRaw ? JSON.parse(auditRaw) : { advisories: {} };
    } catch (error) {
      // If audit fails (no lockfile), just use empty advisories
      audit = { advisories: {} };
    }

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
    console.error(`Error during scan: ${error.message}`);
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
    return `Update to ${info.wanted} (compatibility) or ${info.latest} (latest version).`;
  }
  return 'No action required.';
}

module.exports = { scanDependencies };
