import fs from 'fs';
import path from 'path';

const testResultsDir = path.join(process.cwd(), 'test-results');

const folders = fs.readdirSync(testResultsDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name);

const failedTestFolder = folders.find(name =>
  name.includes('intentional-checkout-failure')
);

if (!failedTestFolder) {
  throw new Error('Could not find failed test folder');
}

const failureDir = path.join(testResultsDir, failedTestFolder);

const files = fs.readdirSync(failureDir);

const errorContextFile = files.find(file => file === 'error-context.md');
const traceFile = files.find(file => file === 'trace.zip');
const screenshotFile = files.find(file => file.endsWith('.png'));
const videoFile = files.find(file => file.endsWith('.webm'));

const errorContext = errorContextFile
  ? fs.readFileSync(path.join(failureDir, errorContextFile), 'utf-8')
  : '';

const triageData = {
  testName: 'intentional checkout failure',
  status: 'failed',

  failureFolder: failedTestFolder,

  errorContext,

  artifacts: {
    trace: traceFile
      ? path.join(failureDir, traceFile)
      : null,

    screenshot: screenshotFile
      ? path.join(failureDir, screenshotFile)
      : null,

    video: videoFile
      ? path.join(failureDir, videoFile)
      : null,
  },
};

const outputDir = path.join(process.cwd(), 'triage-output');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

fs.writeFileSync(
  path.join(outputDir, 'failure.json'),
  JSON.stringify(triageData, null, 2)
);

console.log('Real Playwright failure data extracted successfully.');