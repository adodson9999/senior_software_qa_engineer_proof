import { BasePage } from "./BasePage";

export class DynamicContentPage extends BasePage {
  protected readonly path = "/dynamic_content";

  private readonly selectors = {
    contentText: ".large-10.columns",
    reloadLink: 'a[href="/dynamic_content?with_content=static"]',
  };

  async getContentTexts(): Promise<string[]> {
    const elements: WebdriverIO.Element[] = await $$(this.selectors.contentText);
    const texts: string[] = await Promise.all(elements.map((el: WebdriverIO.Element) => el.getText()));
    return texts;
  }

  async reloadWithStaticContent(): Promise<void> {
    await this.waitAndClick(this.selectors.reloadLink);
    await this.waitForPageLoad();
  }
}