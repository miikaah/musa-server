/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  collectCoverage: true,
  coverageReporters: ["text", "html"],
  preset: "ts-jest",
  setupFiles: ["<rootDir>/src/jestSetup.ts"],
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.spec.ts"],
};
