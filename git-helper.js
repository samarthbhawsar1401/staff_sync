const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');

const dir = __dirname;

// Helper to recursively get files respecting ignores
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

async function initAndCommit() {
  console.log('1. Initializing Git repository in:', dir);
  await git.init({ fs, dir, defaultBranch: 'main' });

  console.log('2. Staging all files...');
  const files = getFiles(dir);
  for (const filepath of files) {
    await git.add({ fs, dir, filepath });
  }
  console.log(`✓ Staged ${files.length} project files.`);

  console.log('3. Creating initial commit...');
  const sha = await git.commit({
    fs,
    dir,
    message: 'Initial commit: StaffSync - Modern Human Resource Management Solution (MERN Stack)',
    author: {
      name: 'Samar',
      email: 'developer@staffsync.local'
    }
  });

  console.log('✓ Successfully committed! SHA:', sha);
  console.log('Git repository is fully initialized with branch: main');
}

initAndCommit().catch(err => {
  console.error('Git error:', err);
  process.exit(1);
});
