import { BasePage } from "./BasePage";

export class DynamicContentPage extends BasePage {
  protected readonly path = "/dynamic_content";

  private readonly selectors = {
    contentText: ".large-10.columns",
    reloadLink: 'a[href="/dynamic_content?with_content=static"]',
  };

  async getContentTexts(): Promise<string[]> {
    const results: string[] = [];
    const elements = await $$(this.selectors.contentText);
    for (const el of elements) {
      results.push(await el.getText());
    }
    return results;
  }

  async reloadWithStaticContent(): Promise<void> {
    await this.waitAndClick(this.selectors.reloadLink);
    await this.waitForPageLoad();
  }
}