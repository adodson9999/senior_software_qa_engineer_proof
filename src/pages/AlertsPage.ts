import { BasePage } from "./BasePage";

/**
 * AlertsPage
 * Maps to https://the-internet.herokuapp.com/javascript_alerts
 * Tests browser dialog handling — important for confirmation
 * flows in critical transaction signing workflows.
 */
export class AlertsPage extends BasePage {
  protected readonly path = "/javascript_alerts";

  private readonly selectors = {
    alertButton: "button[onclick='jsAlert()']",
    confirmButton: "button[onclick='jsConfirm()']",
    promptButton: "button[onclick='jsPrompt()']",
    resultText: "#result",
  };

  async triggerAlert(): Promise<void> {
    await this.waitAndClick(this.selectors.alertButton);
  }

  async triggerConfirm(): Promise<void> {
    await this.waitAndClick(this.selectors.confirmButton);
  }

  async triggerPrompt(): Promise<void> {
    await this.waitAndClick(this.selectors.promptButton);
  }

  async acceptAlert(): Promise<void> {
    await browser.acceptAlert();
  }

  async dismissAlert(): Promise<void> {
    await browser.dismissAlert();
  }

  async getAlertText(): Promise<string> {
    return browser.getAlertText();
  }

  async sendAlertText(text: string): Promise<void> {
    await browser.sendAlertText(text);
    await browser.acceptAlert();
  }

  async getResultText(): Promise<string> {
    return this.getElementText(this.selectors.resultText);
  }
}
