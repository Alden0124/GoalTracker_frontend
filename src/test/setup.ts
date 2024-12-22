import "@testing-library/jest-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";

// 擴展 Vitest 的 expect
expect.extend(matchers);

// 每個測試後清理
afterEach(() => {
  cleanup();
});
