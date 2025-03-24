// jest.config.js
module.exports = {
  testEnvironment: 'node',
  // Setup test environment
  setupFiles: ['<rootDir>/jest.setup.js'],
  // Transform ESM to CJS
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { 
          targets: { node: 'current' },
          modules: 'commonjs'
        }],
        '@babel/preset-react'
      ],
      plugins: [
        '@babel/plugin-transform-modules-commonjs'
      ]
    }]
  },
  // Indicate which files to test
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  // Files to ignore
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  // Module name mapper for aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}; 