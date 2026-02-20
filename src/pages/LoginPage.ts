import { BasePage } from "./BasePage";

/**
 * LoginPage
 * Maps to https://the-internet.herokuapp.com/login
 * Mirrors Proof's identity-verification entry flows.
 */
export class LoginPage extends BasePage {
  protected readonly path = "/login";

  // Selectors
  private readonly selectors = {
    usernameInput: "#username",
    passwordInput: "#password",
    loginButton: 'button[type="submit"]',
    flashMessage: "#flash",
    flashError: "#flash.error",
    flashSuccess: "#flash.success",
    logoutButton: "a[href='/logout']",
  };

  async login(username: string, password: string): Promise<void> {
    await this.waitAndType(this.selectors.usernameInput, username);
    await this.waitAndType(this.selectors.passwordInput, password);
    await this.waitAndClick(this.selectors.loginButton);
  }

  async getFlashMessage(): Promise<string> {
    return this.getElementText(this.selectors.flashMessage);
  }

  async isLoginSuccessful(): Promise<boolean> {
    return this.isElementDisplayed(this.selectors.logoutButton);
  }

  async isErrorDisplayed(): Promise<boolean> {
    return this.isElementDisplayed(this.selectors.flashError);
  }

  async logout(): Promise<void> {
    await this.waitAndClick(this.selectors.logoutButton);
  }

  async getUsernameField(): Promise<WebdriverIO.Element> {
    return $(this.selectors.usernameInput);
  }

  async getPasswordField(): Promise<WebdriverIO.Element> {
    return $(this.selectors.passwordInput);
  }
}
