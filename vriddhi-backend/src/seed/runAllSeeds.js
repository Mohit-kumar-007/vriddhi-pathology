const { execSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '../..');

console.log('🌱 Running all seed scripts...\n');

const seeds = ['seedSettings', 'seedTests', 'seedPackages'];

for (const seed of seeds) {
  console.log(`▶ Running ${seed}...`);
  try {
    execSync(`node ${path.join(__dirname, seed + '.js')}`, {
      stdio: 'inherit',
      cwd: root,
    });
  } catch (err) {
    console.error(`❌ Failed: ${seed}`, err.message);
    process.exit(1);
  }
}

console.log('\n✅ All seeds complete!');
