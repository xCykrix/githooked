import { exists } from './util/fs.ts';
import { getHooks, git } from './util/git.ts';
import { hook } from './script/hook.ts';
import { init } from './script/init.ts';
import { LoggerManager } from '../deps.ts';

export class Install {
  private static installed = true;

  /**
   * Update githooked scripting and permissions.
   */
  public static async update(
    cwd: string,
  ): Promise<void> {
    const logger = LoggerManager.getLogger('install');
    logger.info({
      content: 'Preparing to update the git hooks structure.',
    });

    // Validate git repository.
    if (!(await exists(`${cwd}/.git/`))) {
      logger.error({
        content: 'The current working path does not contain "./.git/".',
      });
      return Deno.exit(-1);
    }

    // Check rev-parse to ensure repository is safe to work with.
    await git(cwd, ['rev-parse', 'HEAD^']).catch((err) => {
      logger.error({
        content: 'The current working path did not "git rev-parse" as expected.',
        context: err,
      });
      return Deno.exit(-1);
    });

    // Check if '.git-hooks' exists for initialize vs update.
    if (!(await exists(`${cwd}/.git-hooks/`))) {
      logger.info({
        content: 'Initializing "./.git-hooks/" in the current working path',
      });
      this.installed = false;
    }

    // Create git-hooks util folder.
    logger.info({
      content: 'Updating "./.git-hooks/" to latest version.',
    });
    await Deno.mkdir(`${cwd}/.git-hooks/_util/`, {
      recursive: true,
      mode: 0o755,
    }).catch((err) => {
      logger.error({
        content: 'Failed to mkdir for "./.git-hooks/_util/".',
        context: err,
      });
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
      logger.info({
        content: 'Initializing "./.git-hooks/" with blank template hooks.',
      });

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
    logger.info({
      content: 'Updating "./.git-hooks/" to the permissions.',
    });
    for await (
      const hook of Deno.readDir(`${cwd}/.git-hooks/`)
    ) {
      if (hook.isFile && !hook.name.includes('.')) {
        await Deno.chmod(
          `${cwd}/.git-hooks/${hook.name}`,
          0o755,
        )
          .catch((err) => {
            logger.error({
              content: 'Unable to update file permissions. Please review error and attempt to run githooked again. Windows is not supported without unix emulation.',
              context: err,
            });
            return Deno.exit(-1);
          });
      }
    }

    // Set the hooksPath.
    logger.info({
      content: 'Setting "core.hooksPath" to use "./.git-hooks".',
    });
    await git(cwd, [
      'config',
      'core.hooksPath',
      './.git-hooks/',
    ]);

    // Initialization has been completed.
    logger.info({
      content: 'Initialized "githooked" in the current working path.',
    });
  }
}
