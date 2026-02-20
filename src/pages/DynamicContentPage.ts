import { BasePage } from "./BasePage";

/**
 * DynamicContentPage
 * Maps to https://the-internet.herokuapp.com/dynamic_content
 * Tests asynchronous UI updates — mirrors Proof's real-time
 * transaction status and notification flows.
 */
export class DynamicContentPage extends BasePage {
  protected readonly path = "/dynamic_content";

  private readonly selectors = {
    contentRows: ".row",
    contentText: ".large-10.columns",
    reloadLink: 'a[href="/dynamic_content?with_content=static"]',
  };

  async getContentTexts(): Promise<string[]> {
    const elements = await $$(this.selectors.contentText);
    return Promise.all(elements.map((el) => el.getText()));
  }

  async reloadWithStaticContent(): Promise<void> {
    await this.waitAndClick(this.selectors.reloadLink);
    await this.waitForPageLoad();
  }

  async waitForContentChange(
    previousTexts: string[],
    timeout = 5000
  ): Promise<boolean> {
    return browser.waitUntil(
      async () => {
        const current = await this.getContentTexts();
        return current.some((text, i) => text !== previousTexts[i]);
      },
      { timeout, timeoutMsg: "Content did not change within timeout" }
    );
  }
}
