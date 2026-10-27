const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');

const dir = __dirname;

const getFiles = (dirPath, relativeTo = dirPath) => {
  let results = [];
  const list = fs.readdirSync(dirPath);
  for (const file of list) {
    if (file === '.git' || file === 'node_modules' || file === 'dist' || file === '.env') continue;
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, relativeTo));
    } else {
      results.push(path.relative(relativeTo, fullPath).replace(/\\/g, '/'));
    }
  }
  return results;
};

async function main() {
  const [,, cmd, remoteUrl, token] = process.argv;

  if (cmd === 'push') {
    if (!remoteUrl || !token) {
      console.error('Usage: node git-helper.js push <github-repo-url> <personal-access-token>');
      process.exit(1);
    }

    console.log(`Setting remote origin: ${remoteUrl}`);
    try {
      await git.addRemote({ fs, dir, remote: 'origin', url: remoteUrl, force: true });
    } catch (e) {
      // remote might already exist
    }

    console.log('Pushing main branch to GitHub...');
    const pushResult = await git.push({
      fs,
      http,
      dir,
      url: remoteUrl,
      remote: 'origin',
      ref: 'main',
      onAuth: () => ({ username: token })
    });

    console.log('✓ Successfully pushed to GitHub!', pushResult);
    return;
  }

  // Default: stage and commit
  console.log('1. Initializing Git repository in:', dir);
  await git.init({ fs, dir, defaultBranch: 'main' });

  console.log('2. Staging all files...');
  const files = getFiles(dir);
  for (const filepath of files) {
    await git.add({ fs, dir, filepath });
  }
  console.log(`✓ Staged ${files.length} project files.`);

  console.log('3. Creating / Updating commit...');
  try {
    const sha = await git.commit({
      fs,
      dir,
      message: 'StaffSync: Modern Human Resource Management Solution (MERN Stack)',
      author: {
        name: 'Samar',
        email: 'developer@staffsync.local'
      }
    });
    console.log('✓ Successfully committed! SHA:', sha);
  } catch (err) {
    if (err.code === 'EmptyCommitError') {
      console.log('Working tree is clean, nothing new to commit.');
    } else {
      throw err;
    }
  }

  console.log('Git repository is up-to-date with branch: main');
}

main().catch(err => {
  console.error('Git error:', err);
  process.exit(1);
});
