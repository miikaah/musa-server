import { beforeEach, beforeAll, vi } from "vitest";

vi.mock("../src/logger");

process.env.MUSA_SRC_PATH = process.cwd();
process.env.MUSA_BASE_URL = "http://localhost";

beforeEach(() => {
  vi.clearAllMocks();
});
