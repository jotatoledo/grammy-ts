module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/test/tsconfig.json'
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
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,js}', '!<rootDir>/src/index.(ts|js)']
};
