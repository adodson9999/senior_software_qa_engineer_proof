import * as fs from "fs";
import * as path from "path";

/**
 * Logger
 * Structured logging utility for the test suite.
 * Outputs to console and to a log file for CI artifact collection.
 */

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

export class Logger {
  private static logDir = path.resolve("./logs");
  private static logFile = path.join(Logger.logDir, `test-run-${Date.now()}.log`);

  private static write(entry: LogEntry): void {
    const line = JSON.stringify(entry);

    // Console output with color
    const colors: Record<LogLevel, string> = {
      [LogLevel.DEBUG]: "\x1b[37m",
      [LogLevel.INFO]: "\x1b[36m",
      [LogLevel.WARN]: "\x1b[33m",
      [LogLevel.ERROR]: "\x1b[31m",
    };
    const reset = "\x1b[0m";
    console.log(`${colors[entry.level]}[${entry.level}] ${entry.message}${reset}`);

    // File output
    try {
      if (!fs.existsSync(Logger.logDir)) {
        fs.mkdirSync(Logger.logDir, { recursive: true });
      }
      fs.appendFileSync(Logger.logFile, line + "\n");
    } catch {
      // Non-fatal: log to file is best-effort
    }
  }

  static debug(message: string, context?: Record<string, unknown>): void {
    this.write({ timestamp: new Date().toISOString(), level: LogLevel.DEBUG, message, context });
  }

  static info(message: string, context?: Record<string, unknown>): void {
    this.write({ timestamp: new Date().toISOString(), level: LogLevel.INFO, message, context });
  }

  static warn(message: string, context?: Record<string, unknown>): void {
    this.write({ timestamp: new Date().toISOString(), level: LogLevel.WARN, message, context });
  }

  static error(message: string, context?: Record<string, unknown>): void {
    this.write({ timestamp: new Date().toISOString(), level: LogLevel.ERROR, message, context });
  }

  static testStart(testName: string): void {
    this.info(`▶ TEST START: ${testName}`);
  }

  static testPass(testName: string, durationMs?: number): void {
    this.info(`✅ TEST PASS: ${testName}${durationMs ? ` (${durationMs}ms)` : ""}`);
  }

  static testFail(testName: string, error: string): void {
    this.error(`❌ TEST FAIL: ${testName}`, { error });
  }
}
