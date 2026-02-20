import { BasePage } from "./BasePage";

export class DynamicContentPage extends BasePage {
  protected readonly path = "/dynamic_content";

  private readonly selectors = {
    contentText: ".large-10.columns",
    reloadLink: 'a[href="/dynamic_content?with_content=static"]',
  };

  async getContentTexts(): Promise<string[]> {
    const elements = await $$(this.selectors.contentText);
    return Promise.all(elements.map((el: WebdriverIO.Element) => el.getText()));
  }

  async reloadWithStaticContent(): Promise<void> {
    await this.waitAndClick(this.selectors.reloadLink);
    await this.waitForPageLoad();
  }
}