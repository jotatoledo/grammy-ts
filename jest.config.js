module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'test/tsconfig.json'
    }
  },
  moduleNameMapper: {
    'grammy-ts': '<rootDir>/src/index.ts'
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testMatch: ['**/test/**/*.test.(ts|js)'],
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.{ts,js}', '!src/index.(ts|js)']
};
