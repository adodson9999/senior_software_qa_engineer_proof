import { BasePage } from "./BasePage";
import * as path from "path";
import * as fs from "fs";

/**
 * FileUploadPage
 * Maps to https://the-internet.herokuapp.com/upload
 * Represents Proof's document upload functionality (deeds, wills, contracts).
 */
export class FileUploadPage extends BasePage {
  protected readonly path = "/upload";

  private readonly selectors = {
    fileInput: "#file-upload",
    uploadButton: "#file-submit",
    uploadedFilename: "#uploaded-files",
    uploadedHeader: "h3",
  };

  async uploadFile(filePath: string): Promise<void> {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`);
    }
    const remoteFilePath = await browser.uploadFile(absolutePath);
    const input = await $(this.selectors.fileInput);
    await input.setValue(remoteFilePath);
    await this.waitAndClick(this.selectors.uploadButton);
  }

  async getUploadedFileName(): Promise<string> {
    return this.getElementText(this.selectors.uploadedFilename);
  }

  async isUploadSuccessful(): Promise<boolean> {
    const header = await this.getElementText(this.selectors.uploadedHeader);
    return header.includes("File Uploaded!");
  }
}
