import axios from "axios";

const BASE_URL = process.env.BASE_URL || "https://the-internet.herokuapp.com";
const API_URL = process.env.API_BASE_URL || "https://httpbin.org";

interface PerformanceResult {
  url: string;
  durationMs: number;
  status: number;
  passed: boolean;
}

const SLA = {
  pageLoad: 3000,
  apiResponse: 1500,
  concurrentUsers: 5,
};

async function measure(url: string, method: "get" | "post" = "get"): Promise<PerformanceResult> {
  const start = Date.now();
  try {
    const response = method === "post"
      ? await axios.post(url, { test: true }, { timeout: 10000 })
      : await axios.get(url, { timeout: 10000 });
    const durationMs = Date.now() - start;
    return { url, durationMs, status: response.status, passed: durationMs < SLA.pageLoad };
  } catch (error: any) {
    return { url, durationMs: Date.now() - start, status: error.response?.status || 0, passed: false };
  }
}

async function measureApi(url: string, method: "get" | "post" = "get"): Promise<PerformanceResult> {
  const start = Date.now();
  try {
    const response = method === "post"
      ? await axios.post(url, { test: true }, { timeout: 10000 })
      : await axios.get(url, { timeout: 10000 });
    const durationMs = Date.now() - start;
    return { url, durationMs, status: response.status, passed: durationMs < SLA.apiResponse };
  } catch (error: any) {
    return { url, durationMs: Date.now() - start, status: error.response?.status || 0, passed: false };
  }
}

async function run(): Promise<void> {
  console.log("🚀 Proof QA — Performance Test Suite");
  console.log("=====================================");

  let allPassed = true;

  console.log("\n📊 Page Load Performance:");
  const pages = [`${BASE_URL}/login`, `${BASE_URL}/dynamic_content`, `${BASE_URL}/upload`];
  for (const page of pages) {
    const r = await measure(page);
    const icon = r.passed ? "✅" : "❌";
    console.log(`  ${icon} ${page.split("/").pop()?.padEnd(20)} ${r.durationMs}ms`);
    if (!r.passed) allPassed = false;
  }

  console.log("\n📊 API Response Performance:");
  const apis: Array<{ url: string; method: "get" | "post" }> = [
    { url: `${API_URL}/get`, method: "get" },
    { url: `${API_URL}/post`, method: "post" },
  ];
  for (const { url, method } of apis) {
    const r = await measureApi(url, method);
    const icon = r.passed ? "✅" : "❌";
    console.log(`  ${icon} ${url.replace(API_URL, "").padEnd(20)} ${r.durationMs}ms (SLA: ${SLA.apiResponse}ms)`);
    if (!r.passed) allPassed = false;
  }

  console.log(`\n⚡ Load Test: ${SLA.concurrentUsers} concurrent requests to /login`);
  const results = await Promise.all(Array.from({ length: SLA.concurrentUsers }, () => measure(`${BASE_URL}/login`)));
  const avg = Math.round(results.reduce((s, r) => s + r.durationMs, 0) / results.length);
  const max = Math.max(...results.map((r) => r.durationMs));
  console.log(`  Avg: ${avg}ms | Max: ${max}ms`);
  console.log(`  ${results.every((r) => r.passed) ? "✅" : "❌"} Concurrent SLA`);

  console.log("\n=====================================");
  console.log(`📋 Result: ${allPassed ? "✅ ALL PASSED" : "❌ FAILURES DETECTED"}`);
  if (!allPassed) process.exit(1);
}

run().catch((err) => { console.error(err); process.exit(1); });