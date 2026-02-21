import axios, { AxiosInstance } from "axios";

/**
 * API Integration Tests
 *
 * Tests REST endpoints against https://httpbin.org (open test API).
 * In Proof context, this mirrors validation of:
 *  - Transaction submission endpoints
 *  - Identity verification API responses
 *  - Webhook delivery and payload integrity
 *  - Authentication token handling
 */

const BASE_URL = process.env.API_BASE_URL || "https://httpbin.org";

describe("🔌 API Integration Tests", () => {
  let client: AxiosInstance;

  beforeEach(() => {
    client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  });

  describe("GET Requests", () => {
    it("should return 200 for a valid GET request", async () => {
      const response = await client.get("/get");
      expect(response.status).toBe(200);
    });

    it("should return correct response structure", async () => {
      const response = await client.get("/get");
      expect(response.data.url).toBeDefined();
      expect(response.data.headers).toBeDefined();
    });

    it("should return query params in response", async () => {
      const response = await client.get("/get?transactionId=TXN-001&status=pending");
      expect(response.data.args["transactionId"]).toBe("TXN-001");
      expect(response.data.args["status"]).toBe("pending");
    });
  });

  describe("POST Requests", () => {
    it("should return 200 for a valid POST request", async () => {
      const payload = {
        transactionId: "TXN-001",
        signerEmail: "signer@example.com",
        documentType: "mortgage",
        status: "initiated",
      };

      const response = await client.post("/post", payload);
      expect(response.status).toBe(200);
    });

    it("should echo back posted JSON payload", async () => {
      const payload = { userId: "usr_123", action: "sign" };
      const response = await client.post("/post", payload);

      expect(response.data.json["userId"]).toBe("usr_123");
      expect(response.data.json["action"]).toBe("sign");
    });

    it("should include Content-Type header in request", async () => {
      const response = await client.post("/post", { test: true });
      expect(response.data.headers["Content-Type"]).toContain("application/json");
    });
  });

  describe("Authentication Header Handling", () => {
    it("should send and receive bearer token", async () => {
      const tokenClient = axios.create({
        baseURL: BASE_URL,
        headers: {
          Authorization: "Bearer proof-test-token-12345",
        },
      });

      const response = await tokenClient.get("/get");
      expect(response.data.headers["Authorization"]).toBe("Bearer proof-test-token-12345");
    });
  });

  describe("Error Handling", () => {
    it("should handle 404 responses gracefully", async () => {
      try {
        await client.get("/status/404");
        fail("Expected 404 error");
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });

    it("should handle 500 server errors", async () => {
      try {
        await client.get("/status/500");
        fail("Expected 500 error");
      } catch (error: any) {
        expect(error.response.status).toBe(500);
      }
    });

    it("should handle 401 unauthorized responses", async () => {
      try {
        await client.get("/status/401");
        fail("Expected 401 error");
      } catch (error: any) {
        expect(error.response.status).toBe(401);
      }
    });
  });

  describe("Response Time SLA", () => {
    it("should respond within acceptable SLA (< 2000ms)", async () => {
      const start = Date.now();
      await client.get("/get");
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(2000);
    });
  });
});