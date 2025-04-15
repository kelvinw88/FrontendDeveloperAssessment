module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!d3|internmap|delaunator|robust-predicates)'
  ],
};