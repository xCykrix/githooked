export class Logger {
  private _basic = true;
  private _detailed = false;

  public setState(basic: boolean, detailed: boolean): void {
    this._basic = basic;
    this._detailed = detailed;
  }

  public always(...args: unknown[]): void {
    console.info(...args);
  }

  public basic(...args: unknown[]): void {
    if (this._basic) {
      console.info(...args);
    }
  }

  public detailed(...args: unknown[]): void {
    if (this._detailed) {
      console.info(...args);
    }
  }

  public error(message: string, error?: Error): void {
    console.error(`Error: ${message}${(error !== undefined ? '\n' : '')}`, (error !== undefined ? error : ''));
  }
}
