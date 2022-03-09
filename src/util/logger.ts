/**
 * Extremely simple logging wrapper used for basic and quiet-style/verbose-style logging.
 */
export class Logger {
  private _basic = true;
  private _detailed = false;

  /**
   * Set the logging state of the application.
   *
   * @param basic If basic logging should be enabled.
   * @param detailed If verbose logging should be enabled.
   */
  public setState(basic: boolean, detailed: boolean): void {
    this._basic = basic;
    this._detailed = detailed;
  }

  /**
   * Send an informational message that is always printed to console.
   *
   * @param args The arguments for console.info.
   */
  public always(...args: unknown[]): void {
    console.info(...args);
  }

  /**
   * Send a basic informational message to console that is only printed if basic logging is enabled.
   *
   * @param args The arguments for console.info.
   */
  public basic(...args: unknown[]): void {
    if (this._basic) {
      console.info(...args);
    }
  }

  /**
   * Send a detailed informational message to console that is only printed if verbose logging is enabled.
   *
   * @param args The arguments for console.info.
   */
  public detailed(...args: unknown[]): void {
    if (this._detailed) {
      console.info(...args);
    }
  }

  /**
   * Send an error message to console that is always printed to console.
   *
   * @param message The context for the error message.
   * @param error The error object.
   */
  public error(message: string, error?: Error): void {
    console.error(
      `Error: ${message}${(error !== undefined ? '\n' : '')}`,
      error !== undefined ? error : '',
    );
  }
}
