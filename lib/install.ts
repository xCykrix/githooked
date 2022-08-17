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
  public static async update(
    cwd: string,
    debug?: boolean,
  ): Promise<void> {
    this.debug = debug ?? false;
    if (this.debug) {
      console.info('Updating "githooked" structure.');
    }

    // Validate git repository.
    if (!(await exists(`${cwd}/.git/`))) {
      console.error(
        'Failed to update "./.git-hooks". The current working path is not a valid git repository.',
      );
      return Deno.exit(-1);
    }

    // Check rev-parse to ensure repository is safe to work with.
    await git(cwd, ['rev-parse', 'HEAD^']).catch((err) => {
      console.error(
        'The current working path is not a stable git repository.',
      );
      console.error(err);
      return Deno.exit(-1);
    });

    // Check if '.git-hooks' exists for initialize vs update.
    if (!(await exists(`${cwd}/.git-hooks/`))) {
      console.info(
        'Initializing "./.git-hooks" for the current working path.',
      );
      this.installed = false;
    }

    // Create git-hooks util folder.
    if (this.debug) console.info('Preparing "./.git-hooks".');
    await Deno.mkdir(`${cwd}/.git-hooks/_util/`, {
      recursive: true,
      mode: 0o755,
    }).catch((err) => {
      // LCOV_EXCL_START
      console.error(
        'Failed to mkdir at "./.git-hooks/_util/".',
      );
      console.error(err);
      return Deno.exit(-1);
    });

    // Write the gitignore and init script.
    await Deno.writeFile(
      `${cwd}/.git-hooks/_util/.gitignore`,
      new TextEncoder().encode('*'),
    );
    await Deno.writeFile(
      `${cwd}/.git-hooks/_util/git-hooked.sh`,
      new TextEncoder().encode(init),
    );

    // First-time installation?
    if (!this.installed) {
      if (this.debug) {
        console.info(
          'Initializng "./.git-hooks" with the default hooks.',
        );
      }

      // Inject placeholder for each hook.
      getHooks().forEach(async (v) => {
        await Deno.writeFile(
          `${cwd}/.git-hooks/${v}`,
          new TextEncoder().encode(
            hook.replace(
              '{{COMMAND}}',
              `# echo "Placeholder git-hook for ${v}."\n\nexit 0`,
            ),
          ),
        );
      });
    }

    // Update permissions for hooks and scripts.
    if (this.debug) {
      console.info(
        'Updating "./.git-hooks" to required permissions.',
      );
    }
    for await (
      const hook of (await Deno.readDir(`${cwd}/.git-hooks/`))
    ) {
      if (hook.isFile && !hook.name.includes('.')) {
        if (this.debug) {
          console.info(
            `Running: chmod 755 ./.git-hooks/${hook.name}`,
          );
        }
        await Deno.chmod(
          `${cwd}/.git-hooks/${hook.name}`,
          0o755,
        )
          .catch((err) => {
            console.error(
              'Unable to update file permissions. Please review error and attempt to run githooked again. Windows is not supported without unix emulation.',
            );
            console.error(err);
            return Deno.exit(-1);
          });
      }
    }

    // Set the hooksPath.
    if (this.debug) {
      console.info(
        'Setting "core.hooksPath" to use "./.git-hooks".',
      );
    }
    await git(cwd, [
      'config',
      'core.hooksPath',
      './.git-hooks/',
    ]);

    // Initialization has been completed.
    console.info(
      'Initialized "githooked" in the current working path.',
    );
  }
}
