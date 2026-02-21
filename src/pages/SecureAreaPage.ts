import { BasePage } from "./BasePage";

/**
 * SecureAreaPage
 * Maps to https://the-internet.herokuapp.com/secure
 * Represents authenticated areas of the Proof platform —
 * accessed only after successful identity verification.
 */
export class SecureAreaPage extends BasePage {
  protected readonly path = "/secure";

  private readonly selectors = {
    pageHeader: "h2",
    subHeader: "h4.subheader",
    logoutButton: "a[href='/logout']",
    flashMessage: "#flash",
  };

  async getPageHeader(): Promise<string> {
    return this.getElementText(this.selectors.pageHeader);
  }

  async getSubHeader(): Promise<string> {
    return this.getElementText(this.selectors.subHeader);
  }

  async isSecureAreaDisplayed(): Promise<boolean> {
    const header = await this.getPageHeader();
    return header.includes("Secure Area");
  }

  async logout(): Promise<void> {
    await this.waitAndClick(this.selectors.logoutButton);
  }

  async getFlashMessage(): Promise<string> {
    return this.getElementText(this.selectors.flashMessage);
  }
}
