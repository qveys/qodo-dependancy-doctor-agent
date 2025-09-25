const { Octokit } = require('@octokit/rest');

async function createPullRequest({ token, owner, repo, branch, base, title, body }) {
  const octokit = new Octokit({ auth: token });
  await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${branch}`,
    sha: (await octokit.git.getRef({ owner, repo, ref: `heads/${base}` })).data.object.sha,
  });
  await octokit.pulls.create({
    owner,
    repo,
    title,
    head: branch,
    base,
    body,
  });
  const prs = await octokit.pulls.list({ owner, repo, head: `${owner}:${branch}` });
  return prs.data[0]?.html_url;
}

module.exports = { createPullRequest };
