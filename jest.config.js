module.exports = {
  collectCoverage: true,
  coveragePathIgnorePatterns: ["<rootDir>/src/api/static.ts"],
  coverageReporters: ["text", "html"],
  setupFiles: ["<rootDir>/.jest/setEnvVars.js"],
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.spec.ts"],
  transformIgnorePatterns: [
    "node_modules/(?!(@miikaah/musa-core|music-metadata|strtok3|peek-readable|file-type|token-types)/)",
  ],
  transform: {
    "^.+\\.ts$": ["@swc/jest"],
    "^.+\\.js$": ["babel-jest"],
  },
};
