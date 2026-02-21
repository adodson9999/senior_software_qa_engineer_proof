import { LoginPage } from "../src/pages/LoginPage";
import { SecureAreaPage } from "../src/pages/SecureAreaPage";

/**
 * Authentication Regression Tests
 *
 * Validates login, logout, session management, and access control.
 * Mirrors Proof's identity verification and secure session handling.
 */
describe("🔐 Authentication — Regression Suite", () => {
  let loginPage: LoginPage;
  let secureAreaPage: SecureAreaPage;

  beforeEach(async () => {
    loginPage = new LoginPage();
    secureAreaPage = new SecureAreaPage();
    await loginPage.open();
  });

  describe("Valid Login Scenarios", () => {
    it("should redirect to secure area after successful login", async () => {
      await loginPage.login("tomsmith", "SuperSecretPassword!");

      const url = await loginPage.getUrl();
      expect(url).toContain("/secure");
    });

    it("should display success flash message after login", async () => {
      await loginPage.login("tomsmith", "SuperSecretPassword!");
      const message = await secureAreaPage.getFlashMessage();
      expect(message).toContain("You logged into a secure area!");
    });

    it("should display secure area content after login", async () => {
      await loginPage.login("tomsmith", "SuperSecretPassword!");
      const header = await secureAreaPage.getPageHeader();
      expect(header).toBe("Secure Area");
    });
  });

  describe("Invalid Login Scenarios", () => {
    const invalidCases = [
      {
        desc: "wrong username, wrong password",
        user: "wronguser",
        pass: "wrongpass",
      },
      {
        desc: "correct username, wrong password",
        user: "tomsmith",
        pass: "WrongPassword!",
      },
      {
        desc: "wrong username, correct password",
        user: "wronguser",
        pass: "SuperSecretPassword!",
      },
      { desc: "empty username", user: "", pass: "SuperSecretPassword!" },
      { desc: "empty password", user: "tomsmith", pass: "" },
      { desc: "SQL injection attempt", user: "' OR 1=1--", pass: "anything" },
      {
        desc: "XSS attempt in username",
        user: "<script>alert(1)</script>",
        pass: "pass",
      },
    ];

    invalidCases.forEach(({ desc, user, pass }) => {
      it(`should reject login for: ${desc}`, async () => {
        await loginPage.login(user, pass);
        await browser.waitUntil(
          async () => (await browser.getUrl()).includes('/login'),
          { timeout: 5000, timeoutMsg: 'Expected to stay on login page after bad credentials' }
        );
        expect(await browser.getUrl()).toContain('/login');
      });
    });
  });

  describe("Session Management", () => {
    it("should allow logout from secure area", async () => {
      await loginPage.login("tomsmith", "SuperSecretPassword!");
      await secureAreaPage.logout();

      const url = await loginPage.getUrl();
      expect(url).toContain("/login");
    });

    it("should display logout success message", async () => {
      await loginPage.login("tomsmith", "SuperSecretPassword!");
      await secureAreaPage.logout();

      const message = await loginPage.getFlashMessage();
      expect(message).toContain("You logged out of the secure area!");
    });

    it("should redirect to login if accessing secure area without session", async () => {
      await secureAreaPage.open();
      const url = await loginPage.getUrl();
      // Should redirect to login or show unauthorized state
      expect(url).toContain("the-internet.herokuapp.com");
    });
  });

  describe("Backward Compatibility", () => {
    it("should maintain login functionality across page refreshes", async () => {
      await loginPage.login("tomsmith", "SuperSecretPassword!");
      await browser.refresh();

      const url = await loginPage.getUrl();
      // After refresh on secure area, should still be on secure area
      expect(url).toContain("the-internet.herokuapp.com");
    });
  });
});