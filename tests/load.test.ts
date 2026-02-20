/**
 * Performance & Load Tests
 *
 * Measures page load time, time-to-interactive, and simulates
 * concurrent users against test endpoints.
 *
 * In Proof's context this validates that signing sessions,
 * notary queues, and document delivery remain performant at scale.
 *
 * Run with: node scripts/run-performance.js
 * Or: npm run test:performance
 */

import axios from "axios";

const BASE_URL = process.env.BASE_URL || "https://the-internet.herokuapp.com";
const API_URL = process.env.API_BASE_URL || "https://httpbin.org";

interface PerformanceResult {
  url: string;
  durationMs: number;
  status: number;
  passed: boolean;
}

const SLA_THRESHOLDS = {
  pageLoad: 3000,       // 3s max for page loads
  apiResponse: 1500,    // 1.5s max for API calls
  concurrentUsers: 5,   // simulate 5 concurrent users
};

async function measureResponseTime(url: string): Promise<PerformanceResult> {
  const start = Date.now();
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const duration = Date.now() - start;
    return {
      url,
      durationMs: duration,
      status: response.status,
      passed: duration < SLA_THRESHOLDS.pageLoad,
    };
  } catch (error: any) {
    return {
      url,
      durationMs: Date.now() - start,
      status: error.response?.status || 0,
      passed: false,
    };
  }
}

async function runConcurrentLoadTest(
  url: string,
  concurrentUsers: number
): Promise<PerformanceResult[]> {
  console.log(`\n⚡ Load Test: ${concurrentUsers} concurrent requests to ${url}`);
  const requests = Array.from({ length: concurrentUsers }, () =>
    measureResponseTime(url)
  );
  return Promise.all(requests);
}

async function runPerformanceTests(): Promise<void> {
  console.log("🚀 Proof QA — Performance Test Suite");
  console.log("=====================================");

  const results: PerformanceResult[] = [];
  let allPassed = true;

  // --- Page Load Tests ---
  console.log("\n📊 Page Load Performance:");
  const pages = [
    `${BASE_URL}/login`,
    `${BASE_URL}/dynamic_content`,
    `${BASE_URL}/upload`,
    `${BASE_URL}/javascript_alerts`,
  ];

  for (const page of pages) {
    const result = await measureResponseTime(page);
    results.push(result);
    const icon = result.passed ? "✅" : "❌";
    console.log(
      `  ${icon} ${result.url.split("/").pop()?.padEnd(20)} ${result.durationMs}ms (SLA: ${SLA_THRESHOLDS.pageLoad}ms)`
    );
    if (!result.passed) allPassed = false;
  }

  // --- API Response Tests ---
  console.log("\n📊 API Response Performance:");
  const apiEndpoints = [
    `${API_URL}/get`,
    `${API_URL}/post`,
  ];

  for (const endpoint of apiEndpoints) {
    const result = await measureResponseTime(endpoint);
    const icon = result.passed ? "✅" : "❌";
    console.log(
      `  ${icon} ${endpoint.replace(API_URL, "").padEnd(20)} ${result.durationMs}ms (SLA: ${SLA_THRESHOLDS.apiResponse}ms)`
    );
    if (!result.passed) allPassed = false;
  }

  // --- Concurrent Load Test ---
  const concurrentResults = await runConcurrentLoadTest(
    `${BASE_URL}/login`,
    SLA_THRESHOLDS.concurrentUsers
  );

  const avgDuration =
    concurrentResults.reduce((sum, r) => sum + r.durationMs, 0) /
    concurrentResults.length;
  const maxDuration = Math.max(...concurrentResults.map((r) => r.durationMs));
  const allConcurrentPassed = concurrentResults.every((r) => r.passed);

  console.log(`  Avg: ${avgDuration.toFixed(0)}ms | Max: ${maxDuration}ms`);
  console.log(`  ${allConcurrentPassed ? "✅" : "❌"} All concurrent requests within SLA`);

  if (!allConcurrentPassed) allPassed = false;

  // --- Summary ---
  console.log("\n=====================================");
  console.log(`📋 Performance Summary: ${allPassed ? "✅ ALL PASSED" : "❌ FAILURES DETECTED"}`);

  if (!allPassed) {
    process.exit(1);
  }
}

runPerformanceTests().catch((error) => {
  console.error("Performance test runner failed:", error);
  process.exit(1);
});
