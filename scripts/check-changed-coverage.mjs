import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const COVERAGE_FILE = resolve('coverage/coverage-final.json');
const COVERAGE_THRESHOLD = Number(process.env.CHANGED_COVERAGE_THRESHOLD ?? '90');
const SOURCE_FILE_PATTERN = /^src\/.*\.(?:ts|tsx)$/;
const TEST_FILE_PATTERN = /(?:__tests__|\.test\.|\.spec\.)/;
const DECLARATION_FILE_PATTERN = /\.d\.ts$/;
const ZERO_SHA = '0000000000000000000000000000000000000000';
// Keep in sync with jest.config.cjs collectCoverageFrom exclusions.
const INTENTIONAL_COVERAGE_EXCLUSIONS = [
  /^src\/app\/interfaces\//,
  /\/page\.tsx$/,
  /\/layout\.tsx$/,
  /\/constants\.ts$/,
  /Types\.ts$/,
  /\.types\.ts$/,
  /^src\/app\/components\/endorsedProviders\/endorsedProviderPageData\.ts$/,
  /^src\/app\/components\/emergingInstitutions\/emergingProviderPageData\.ts$/,
  /TabSectionsData\.ts$/,
  /^src\/app\/components\/endorsedProviders\/vetStatIcons\.ts$/,
  /^src\/app\/components\/endorsedProviders\/endorsedProviderBrandAssets\.ts$/,
  /^src\/app\/components\/endorsedProviders\/supportFrameworkSectionIcons\.ts$/,
  /^src\/app\/utilities\/metadata\//,
  /^src\/auth\.ts$/,
  /^src\/app\/sitemap\.xml\/route\.ts$/,
  /^src\/app\/robots\.txt\/route\.ts$/,
  /^src\/testUtils\//,
];

const isIntentionallyExcluded = (relativeFile) =>
  INTENTIONAL_COVERAGE_EXCLUSIONS.some((pattern) => pattern.test(relativeFile));

const runGit = (args) =>
  execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    // Image/binary diffs under src/ can exceed the default 1MB buffer.
    maxBuffer: 64 * 1024 * 1024,
  });

const resolveBaseRef = () => {
  if (process.env.COVERAGE_BASE_REF && process.env.COVERAGE_BASE_REF !== ZERO_SHA) {
    return process.env.COVERAGE_BASE_REF;
  }

  // Prefer the PR/base branch when CI provides it (GitHub Actions / Vercel).
  const githubBase = process.env.GITHUB_BASE_REF;
  if (githubBase) {
    const remoteBase = `origin/${githubBase}`;
    try {
      runGit(['rev-parse', '--verify', remoteBase]);
      return remoteBase;
    } catch {
      // Fall through to origin/main / HEAD^.
    }
  }

  try {
    runGit(['rev-parse', '--verify', 'origin/main']);
    return 'origin/main';
  } catch {
    return 'HEAD^';
  }
};

const parseChangedLines = (diff) => {
  const changedLinesByFile = new Map();
  let currentFile;

  diff.split('\n').forEach((line) => {
    if (line.startsWith('+++ b/')) {
      currentFile = line.slice(6);
      return;
    }

    if (!currentFile || !line.startsWith('@@')) {
      return;
    }

    const match = line.match(/\+(\d+)(?:,(\d+))?/);
    if (!match) {
      return;
    }

    const start = Number(match[1]);
    const count = Number(match[2] ?? '1');
    const lines = changedLinesByFile.get(currentFile) ?? new Set();

    for (let offset = 0; offset < count; offset += 1) {
      lines.add(start + offset);
    }

    changedLinesByFile.set(currentFile, lines);
  });

  return changedLinesByFile;
};

const mergeChangedLines = (target, source) => {
  source.forEach((lines, file) => {
    const existing = target.get(file) ?? new Set();
    lines.forEach((line) => existing.add(line));
    target.set(file, existing);
  });
};

const getChangedLines = () => {
  const baseRef = resolveBaseRef();
  const sourcePathspecs = [':(glob)src/**/*.ts', ':(glob)src/**/*.tsx'];
  const changedLines = parseChangedLines(
    runGit(['diff', '--unified=0', `${baseRef}...HEAD`, '--', ...sourcePathspecs]),
  );

  // Include staged and unstaged local edits when this runs before a commit.
  mergeChangedLines(
    changedLines,
    parseChangedLines(runGit(['diff', '--unified=0', 'HEAD', '--', ...sourcePathspecs])),
  );

  return changedLines;
};

const intersectsChangedLine = (location, changedLines) => {
  for (let line = location.start.line; line <= location.end.line; line += 1) {
    if (changedLines.has(line)) {
      return true;
    }
  }
  return false;
};

const isMeasurableSourceFile = (relativeFile) =>
  SOURCE_FILE_PATTERN.test(relativeFile) &&
  !TEST_FILE_PATTERN.test(relativeFile) &&
  !DECLARATION_FILE_PATTERN.test(relativeFile);

const coverage = JSON.parse(readFileSync(COVERAGE_FILE, 'utf8'));
const changedLinesByFile = getChangedLines();
let coveredStatements = 0;
let changedStatements = 0;
const uncovered = [];
const missingCoverageEntries = [];

changedLinesByFile.forEach((changedLines, relativeFile) => {
  if (!isMeasurableSourceFile(relativeFile)) {
    return;
  }

  const absoluteFile = resolve(relativeFile);
  const fileCoverage = coverage[absoluteFile];
  if (!fileCoverage) {
    if (isIntentionallyExcluded(relativeFile)) {
      return;
    }
    missingCoverageEntries.push(relativeFile);
    return;
  }

  Object.entries(fileCoverage.statementMap).forEach(([statementId, location]) => {
    if (!intersectsChangedLine(location, changedLines)) {
      return;
    }

    changedStatements += 1;
    if (fileCoverage.s[statementId] > 0) {
      coveredStatements += 1;
      return;
    }

    uncovered.push(`${relativeFile}:${location.start.line}`);
  });
});

if (missingCoverageEntries.length > 0) {
  console.error(
    'Changed source files are missing from Jest coverage output ' +
      '(excluded from collectCoverageFrom or never instrumented):\n' +
      missingCoverageEntries.join('\n'),
  );
  process.exit(1);
}

if (changedStatements === 0) {
  console.log('Changed coverage: no executable source statements changed.');
  process.exit(0);
}

const changedCoverage = (coveredStatements / changedStatements) * 100;
console.log(
  `Changed statement coverage: ${changedCoverage.toFixed(2)}% ` +
    `(${coveredStatements}/${changedStatements}); required ${COVERAGE_THRESHOLD}%`,
);

if (changedCoverage < COVERAGE_THRESHOLD) {
  console.error(`Uncovered changed statements:\n${uncovered.join('\n')}`);
  process.exit(1);
}
