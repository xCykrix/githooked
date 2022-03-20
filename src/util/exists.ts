/**
 * Verify that a file or directory exists on disk.
 *
 * @param path The path to the file or directory.
 *
 * @returns If the file or directory exists.
 */
export async function exists(
  path: string,
): Promise<
  boolean
> {
  try {
    await Deno
      .stat(
        path,
      );
    return true;
  } catch (err: unknown) {
    if (
      err instanceof
        Deno
          .errors
          .NotFound
    ) {
      return false;
    }
    throw err;
  }
}
