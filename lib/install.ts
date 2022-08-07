import { exists } from './util/fs.ts';
import { getHooks, git } from './util/git.ts';
import { hook } from './script/hook.ts';
import { init } from './script/init.ts';

export class Install {
  private static debug = false;
  private static installed = true;

  /**
   * Update githooked scripting and permissions.
   */
  public static async update(debug?: boolean): Promise<void> {
    this.debug = debug ?? false;

    if (this.debug) {
      console.info('Updating "githooked" structure.');
    }

    if (!(await exists('./.git/'))) {
      console.error(
        'Failed to update "./.git-hooks". The current working path is not a valid git repository.',
      );
      return Deno.exit(-1);
    }

    await git(['rev-parse']).catch((err) => {
      console.error(
        'The current working path is not a stable git repository.',
      );
      console.error(err);
      return Deno.exit(-1);
    });

    if (!(await exists('./.git-hooks/'))) {
      console.info(
        'Initializing "./.git-hooks" for the current working path.',
      );
      this.installed = false;
    }

    if (this.debug) console.info('Preparing "./.git-hooks".');
    await Deno.mkdir('./.git-hooks/_util/', {
      recursive: true,
      mode: 0o755,
    }).catch((err) => {
      console.error(
        'Failed to mkdir at "./.git-hooks/_util/".',
      );
      console.error(err);
      return Deno.exit(-1);
    });
    await Deno.writeFile(
      './.git-hooks/_util/.gitignore',
      new TextEncoder().encode('*'),
    );
    await Deno.writeFile(
      './.git-hooks/_util/git-hooked.sh',
      new TextEncoder().encode(init),
    );

    if (!this.installed) {
      if (this.debug) {
        console.info(
          'Initializng "./.git-hooks" with the default hooks.',
        );
      }

      getHooks().forEach(async (v) => {
        await Deno.writeFile(
          `./.git-hooks/${v}`,
          new TextEncoder().encode(
            hook.replace(
              '{{COMMAND}}',
              `echo "Placeholder git-hook for ${v}."\n\nexit 0`,
            ),
          ),
        );
      });
    }

    if (this.debug) {
      console.info(
        'Updating "./.git-hooks" to required permissions.',
      );
    }
    for await (
      const hook of (await Deno.readDir('./.git-hooks/'))
    ) {
      if (hook.isFile && !hook.name.includes('.')) {
        if (this.debug) {
          console.info(
            `Running: chmod 755 ./.git-hooks/${hook.name}`,
          );
        }
        await Deno.chmod(`./.git-hooks/${hook.name}`, 0o755)
          .catch((err) => {
            console.error(
              'Unable to update file permissions. Please review error and attempt to run githooked again. Windows is not supported without unix emulation.',
            );
            console.error(err);
            return Deno.exit(-1);
          });
      }
    }

    if (this.debug) {
      console.info(
        'Setting "core.hooksPath" to use "./.git-hooks".',
      );
    }
    await git(['config', 'core.hooksPath', './.git-hooks/']);

    console.info();
    console.info(
      'Installed "githooked" to the current working path.',
    );
  }
}
