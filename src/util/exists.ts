/**
 * Check if a file or directory exists on disk.
 *
 * @param path - The path of the file or directory.
 *
 * @returns A boolean indicating if the provided path exists on disk.
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
