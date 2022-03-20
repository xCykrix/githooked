import { Args, parse } from './deps.ts';

export class CommandLineInterface {
  private readonly title: string;
  private readonly description: string;
  private readonly version: string;
  private readonly options: CommandLineOptions;

  private argv: CommandLineArgumentValidator =
    new CommandLineArgumentValidator();
  private commandAliasMapping: CommandAliases[] = [];
  private optionAliasMapping: OptionAliases[] = [];

  public constructor(
    title: string,
    description: string,
    version: string,
    options: CommandLineOptions,
  ) {
    this.title = title;
    this.description = description;
    this.version = version;
    this.options = options;
  }

  /**
   * Add the defaults to the CLI runtime.
   *
   * - help
   * - version
   * - verbose
   */
  public defaults(): CommandLineInterface {
    this.addOption('help', ['h'], 'Display this help message.')
      .addOption(
        'version',
        [],
        'Display the version and additional acknowledgements.',
      )
      .addOption(
        'verbose',
        ['v'],
        'Enable additional information output for debugging purposes.',
      );
    return this;
  }

  /**
   * Add a new command to the command line interface.
   *
   * @param base - The base id of the command.
   * @param aliases - The aliases of the command.
   * @param description - The description of the command.
   * @param callback - The callback function to process the base command. This will digest the flag values.
   * @returns
   */
  public addCommand(
    base: string,
    aliases: string[],
    description: string,
    callback: CommandCallback,
  ): CommandLineInterface {
    this.commandAliasMapping.push({
      id: base,
      base,
      description,
      callback,
    });
    for (const alias of aliases) {
      this.commandAliasMapping.push({
        id: alias,
        base,
        description,
        callback,
      });
    }
    return this;
  }

  public addOption(
    base: string,
    aliases: string[],
    description: string,
  ): CommandLineInterface {
    this.optionAliasMapping.push({
      id: base,
      base,
      description,
    });
    for (const alias of aliases) {
      this.optionAliasMapping.push({
        id: alias,
        base,
        description,
      });
    }
    return this;
  }

  public async run(args: string[]): Promise<void> {
    // Build the base of the banner.
    const banner = [
      `${this.title} - ${
        !this.version.startsWith('v') ? 'v' : ''
      }${this.version}`,
      `  - ${this.description}`,
      ``,
    ];
    this.argv.extract(args, this.optionAliasMapping);

    // Handle the help menu.
    if (this.argv.get('help') === true) {
      // Add the 'INSTALL:' section if provided.
      if (
        this.options.install !== undefined &&
        this.options.install.length > 0
      ) {
        banner.push('INSTALL:');
        for (const install of this.options.install) {
          banner.push(`  > ${install}`);
        }
        banner.push('');
      }

      // Add the 'UPGRADE:' section if provided.
      if (
        this.options.upgrade !== undefined &&
        this.options.upgrade.length > 0
      ) {
        banner.push('UPGRADE:');
        for (const upgrade of this.options.upgrade) {
          banner.push(`  > ${upgrade}`);
        }
        banner.push('');
      }

      // Add the 'USAGE:' section.
      banner.push(
        ...[
          `USAGE:`,
          `  > ${this.title}${
            this.commandAliasMapping.length > 0
              ? ` [command]`
              : ''
          }${
            this.optionAliasMapping.length > 0
              ? ' [options]'
              : ''
          }`,
          '',
        ],
      );

      // Add the 'COMMANDS:' section.
      if (this.commandAliasMapping.length > 0) {
        banner.push('COMMANDS:');
        const index: {
          [key: string]: {
            list: string[];
            description: string;
          };
        } = {};
        for (const command of this.commandAliasMapping) {
          if (index[command.base] === undefined) {
            index[command.base] = {
              list: [command.id],
              description: command.description,
            };
            continue;
          }
          index[command.base] = {
            list: [
              ...index[command.base]!.list,
              `${command.id}`,
            ],
            description: index[command.base]!.description,
          };
        }
        for (const command of Object.values(index)) {
          const list = command.list.join(', ');
          banner.push(
            `  ${list.padEnd(48, ' ')}${command.description}`,
          );
        }
        banner.push('');
      }

      // TODO: Add the 'OPTIONS:' section.
      if (this.optionAliasMapping.length > 0) {
        banner.push('OPTIONS:');
        const index: {
          [key: string]: {
            list: string[];
            description: string;
          };
        } = {};
        for (const alias of this.optionAliasMapping) {
          if (index[alias.base] === undefined) {
            index[alias.base] = {
              list: [
                `${
                  alias.id.length === 1
                    ? `-${alias.id}`
                    : `--${alias.id}`
                }`,
              ],
              description: alias.description,
            };
            continue;
          }
          index[alias.base] = {
            list: [
              ...index[alias.base]!.list,
              `${
                alias.id.length === 1
                  ? `-${alias.id}`
                  : `--${alias.id}`
              }`,
            ],
            description: index[alias.base]!.description,
          };
        }
        for (const alias of Object.values(index)) {
          const list = alias.list.join(', ');
          banner.push(
            `  ${list.padEnd(48, ' ')}${alias.description}`,
          );
        }
        banner.push('');
      }

      console.info(banner.join('\n'));
      Deno.exit(0);
    }

    // Handle the version menu.
    if (this.argv.get('version') === true) {
      banner.push(
        ...(this.options.versionBanner ?? this.version),
      );

      console.info(banner.join('\n'));
      Deno.exit(0);
    }

    // Print the banner and begin processing the application.
    console.info(banner.join('\n'));

    // Pass to the command callback handler.
    const selectedCommand =
      (this.argv.get('_') as string[]).shift() ??
        this.options.defaultCommand;
    const command = this.commandAliasMapping.filter((v) => {
      return v.base === selectedCommand.toLowerCase();
    });
    await command[0]?.callback(this.argv);

    Deno.exit(0);
  }
}

export class CommandLineArgumentValidator {
  private args: Args = {
    _: [],
  };

  /**
   * Process and extract the aliases to their proper base flag. Updates the internal cache.
   *
   * @param args - The args to process.
   * @param aliases - The aliases to process.
   */
  public extract(
    args: string[],
    aliases: OptionAliases[],
  ): void {
    this.args = parse(args, {
      boolean: true,
    });
    for (const alias of aliases) {
      if (this.args[alias.id] !== undefined) {
        this.args[alias.base] = this.args[alias.id];
      }
    }
  }

  /**
   * Get the value associated with a command-line flag.
   *
   * @param id - The command line flag to get.
   * @returns - The value associated with the flag. This can be a string, string[] (for '_'), boolean, or undefined.
   */
  public get(
    id: string,
  ): string | string[] | boolean | undefined {
    return this.args[id];
  }
}

/** CommandLineOptions */
export interface CommandLineOptions {
  /** The command(s) used to install the tool, listed under '--help'. Useful for self-service upgrade. */
  install?: string[];
  /** The command(s) used to upgrade the tool, listed under '--help'. Useful for built-in upgrade. */
  upgrade?: string[];
  /** The default command to be called. Will cause an error if this does not exist. */
  defaultCommand: string;

  /** The licensing and acknowledgements for the credits section listed under '--version' */
  versionBanner?: string[];
}

/** CommandCallback */
export type CommandCallback = (
  argv: CommandLineArgumentValidator,
) => Promise<void>;

/** CommandAliases @private */
export type CommandAliases = {
  id: string;
  base: string;
  description: string;
  callback: CommandCallback;
};

/** OptionAliases @private */
export type OptionAliases = {
  id: string;
  base: string;
  description: string;
};
