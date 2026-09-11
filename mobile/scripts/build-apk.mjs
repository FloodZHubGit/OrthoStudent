import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const gradle = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
const result = spawnSync(gradle, ['assembleDebug'], { cwd: join(root, 'android'), stdio: 'inherit', shell: process.platform === 'win32' });
if (result.status !== 0) process.exit(result.status || 1);
const source = join(root, 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
const outputDir = join(root, 'releases');
const destination = join(outputDir, 'OrthoPlanning.apk');
if (!existsSync(source)) throw new Error(`APK introuvable : ${source}`);
mkdirSync(outputDir, { recursive: true });
copyFileSync(source, destination);
console.log(`\nAPK prêt à partager : ${destination}`);
