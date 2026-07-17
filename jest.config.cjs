module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Parallelize across CPUs; 75% was fastest on an 8-core machine (~12s vs ~17s serial).
  maxWorkers: '75%',
  // Cap idle worker memory so long parallel runs recycle workers instead of hanging.
  workerIdleMemoryLimit: '512MB',
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
    '**/?(*.)+(spec|test).ts',
    '**/?(*.)+(spec|test).tsx',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(png|jpg|jpeg|gif|webp|svg)$': '<rootDir>/jest.fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
          target: 'ES2022',
          isolatedModules: true,
        },
      },
    ],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/testUtils/**',
    // No-logic exclusions: type-only, static data, page/layout, constants-only
    '!src/app/interfaces/**',
    '!src/**/page.tsx',
    '!src/**/layout.tsx',
    '!src/**/constants.ts',
    '!src/app/components/endorsedProviders/endorsedProviderPageData.ts',
    '!src/app/components/emergingInstitutions/emergingProviderPageData.ts',
    '!src/app/components/tabSection/*TabSectionsData.ts',
    '!src/app/components/endorsedProviders/vetStatIcons.ts',
    '!src/app/components/endorsedProviders/endorsedProviderBrandAssets.ts',
    '!src/app/components/endorsedProviders/supportFrameworkSectionIcons.ts',
    '!src/app/utilities/metadata/**',
    '!src/auth.ts',
    '!src/app/sitemap.xml/route.ts',
    '!src/app/robots.txt/route.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'html', 'lcov', 'json', 'json-summary'],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90,
    },
  },
};
