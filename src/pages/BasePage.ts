/**
 * BasePage
 * All page objects extend this class. Provides shared navigation,
 * wait helpers, and logging wrappers used across the test suite.
 */
export abstract class BasePage {
  protected abstract readonly path: string;

  async open(): Promise<void> {
    await browser.url(this.path);
    await this.waitForPageLoad();
  }

  async waitForPageLoad(): Promise<void> {
    await browser.waitUntil(
      async () => {
        const state = await browser.execute(() => document.readyState);
        return state === "complete";
      },
      { timeout: 10000, timeoutMsg: "Page did not finish loading within 10s" }
    );
  }

  async getTitle(): Promise<string> {
    return browser.getTitle();
  }

  async getUrl(): Promise<string> {
    return browser.getUrl();
  }

  async takeScreenshot(name: string): Promise<void> {
    await browser.saveScreenshot(`./screenshots/${name}-${Date.now()}.png`);
  }

  protected async waitAndClick(selector: string): Promise<void> {
    const element = await $(selector);
    await element.waitForClickable({ timeout: 8000 });
    await element.click();
  }

  protected async waitAndType(selector: string, text: string): Promise<void> {
    const element = await $(selector);
    await element.waitForDisplayed({ timeout: 8000 });
    await element.clearValue();
    await element.setValue(text);
  }

  protected async getElementText(selector: string): Promise<string> {
    const element = await $(selector);
    await element.waitForDisplayed({ timeout: 8000 });
    return element.getText();
  }

  protected async isElementDisplayed(selector: string): Promise<boolean> {
    try {
      const element = await $(selector);
      return element.isDisplayed();
    } catch {
      return false;
    }
  }
}
