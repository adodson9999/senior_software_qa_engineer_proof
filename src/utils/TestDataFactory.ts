/**
 * TestDataFactory
 *
 * Centralized test data generation for consistent, reproducible tests.
 * Separating test data from test logic is a QA best practice that
 * makes maintenance and scaling much easier.
 */

export interface UserCredentials {
  username: string;
  password: string;
  role?: string;
}

export interface TransactionPayload {
  transactionId: string;
  signerEmail: string;
  documentType: string;
  status: string;
}

export class TestDataFactory {
  static readonly validUser: UserCredentials = {
    username: "tomsmith",
    password: "SuperSecretPassword!",
    role: "authenticated_user",
  };

  static readonly invalidUsers: UserCredentials[] = [
    { username: "wronguser", password: "wrongpass" },
    { username: "tomsmith", password: "WrongPassword!" },
    { username: "", password: "SuperSecretPassword!" },
    { username: "tomsmith", password: "" },
    { username: "' OR 1=1--", password: "anything" },
    { username: "<script>alert(1)</script>", password: "xss" },
  ];

  static generateTransactionId(prefix = "TXN"): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  static createTransactionPayload(
    overrides: Partial<TransactionPayload> = {}
  ): TransactionPayload {
    return {
      transactionId: this.generateTransactionId(),
      signerEmail: `signer-${Date.now()}@proof-test.com`,
      documentType: "mortgage",
      status: "initiated",
      ...overrides,
    };
  }

  static readonly documentTypes = [
    "mortgage",
    "deed",
    "will",
    "auto_sale",
    "real_estate_closing",
  ] as const;

  static readonly alertExpectations = {
    alert: {
      text: "I am a JS Alert",
      result: "You successfully clicked an alert",
    },
    confirm: {
      text: "I am a JS Confirm",
      acceptResult: "You clicked: Ok",
      dismissResult: "You clicked: Cancel",
    },
    prompt: {
      text: "I am a JS prompt",
    },
  };
}
