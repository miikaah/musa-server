module.exports = {
  collectCoverage: true,
  coveragePathIgnorePatterns: ["<rootDir>/src/api/static.ts"],
  coverageReporters: ["text", "html"],
  setupFiles: ["<rootDir>/.jest/setEnvVars.js"],
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.spec.ts"],
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
};
