import js from '@eslint/js';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import jest from 'eslint-plugin-jest';
import jestDom from 'eslint-plugin-jest-dom';
import reactHooks from 'eslint-plugin-react-hooks';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';

const SOURCE_FILES = [
  'src/**/*.{js,jsx,ts,tsx}',
  '!src/**/__tests__/**/*.{js,jsx,ts,tsx}',
  '!src/**/*.{spec,test}.{js,jsx,ts,tsx}',
];
const TEST_FILES = [
  'src/**/__tests__/**/*.{js,jsx,ts,tsx}',
  'src/**/*.{spec,test}.{js,jsx,ts,tsx}',
];
const CONFIG_FILES = ['*.{js,cjs,mjs,ts}', 'scripts/**/*.{js,cjs,mjs,ts}'];
const asWarnings = (rules) =>
  Object.fromEntries(
    Object.entries(rules).map(([ruleName, value]) => [
      ruleName,
      Array.isArray(value) ? ['warn', ...value.slice(1)] : 'warn',
    ]),
  );

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.netlify/**',
      'out/**',
      'deliverables/**',
      'coverage/**',
    ],
  },
  js.configs.recommended,
  ...nextVitals,
  ...nextTs,
  {
    files: SOURCE_FILES,
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.flat['recommended-latest'].rules,
      // Existing production baseline is 18; lower this as legacy functions are split.
      complexity: ['error', 18],
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'max-depth': ['error', 4],
      'max-lines-per-function': ['warn', { max: 150, skipBlankLines: true, skipComments: true }],
      'max-nested-callbacks': ['error', 4],
      'no-else-return': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
  {
    // TODO: Split this legacy control into focused hooks/helpers.
    files: ['src/app/components/formElements/Dropdown/DropdownInput.tsx'],
    rules: {
      complexity: ['error', 38],
      'max-lines-per-function': 'off',
    },
  },
  {
    // Legacy surfaces slightly over the 150-line guide; keep tracked for later splits.
    files: [
      'src/app/components/auth/AuthInitSignUp.tsx',
      'src/app/components/footer/Footer.tsx',
      'src/app/components/page.tsx',
      'src/app/endorsements/page.tsx',
    ],
    rules: {
      'max-lines-per-function': ['warn', { max: 200, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    ...jest.configs['flat/recommended'],
    files: TEST_FILES,
    languageOptions: {
      ...jest.configs['flat/recommended'].languageOptions,
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
      },
    },
    rules: {
      ...asWarnings(jest.configs['flat/recommended'].rules),
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
      'jest/expect-expect': 'off',
      'jest/no-conditional-expect': 'off',
    },
  },
  {
    ...testingLibrary.configs['flat/react'],
    files: TEST_FILES,
    rules: asWarnings(testingLibrary.configs['flat/react'].rules),
  },
  {
    ...jestDom.configs['flat/recommended'],
    files: TEST_FILES,
    rules: asWarnings(jestDom.configs['flat/recommended'].rules),
  },
  {
    files: TEST_FILES,
    rules: {
      complexity: ['error', 20],
      'max-lines-per-function': 'off',
      '@next/next/no-img-element': 'off',
      'jsx-a11y/alt-text': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-require-imports': 'off',
      'jest-dom/prefer-to-have-style': 'off',
      'jest-dom/prefer-to-have-class': 'off',
      'react/display-name': 'off',
      'testing-library/no-container': 'off',
      'testing-library/no-node-access': 'off',
      'testing-library/prefer-screen-queries': 'off',
      'testing-library/no-unnecessary-act': 'off',
      'testing-library/render-result-naming-convention': 'off',
    },
  },
  {
    files: CONFIG_FILES,
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  prettier,
  {
    files: SOURCE_FILES,
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-unused-expressions': 'error',
      // Fail the quality gate on the React Compiler / hooks issues tracked in errors.txt.
      'react-hooks/purity': 'error',
      'react-hooks/refs': 'error',
      'react-hooks/immutability': 'error',
      'react-hooks/set-state-in-effect': 'error',
      'react-hooks/incompatible-library': 'error',
      'react-hooks/preserve-manual-memoization': 'warn',
    },
  },
  // Must stay last: flat-config `files` negations are unreliable, so re-assert test overrides.
  {
    files: TEST_FILES,
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@next/next/no-img-element': 'off',
      'jsx-a11y/alt-text': 'off',
      'max-lines-per-function': 'off',
      'testing-library/prefer-screen-queries': 'off',
      'testing-library/no-unnecessary-act': 'off',
      'testing-library/render-result-naming-convention': 'off',
      'jest-dom/prefer-to-have-class': 'off',
      'jest/expect-expect': 'off',
      'jest/no-conditional-expect': 'off',
    },
  },
];

export default eslintConfig;
