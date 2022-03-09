// The locked state of the permissions for runtime resolution.
const stateLock = new Map<string, PermissionRequestState>();

export async function initializePermissions(
  group: PermissionRequestGroup[],
  options: PermissionRequestOptions,
): Promise<PermissionRequestResult> {
  const result: PermissionRequestResult = {
    error: false,
    granted: [],
    denied: [],
  };

  // Iterate the requests and build the state.
  for (const request of group) {
    // Apppend the request to the lock state for initial processing.
    stateLock.set(request.id, {
      state: 'prompt',
      descriptor: request.descriptor,
      _ipx: null,
    });

    // Request the permission via prompt or explicit definition check.
    await updatePermission(request.id, options).catch(() => {
      // Catch an error (due to rejection) and set the state to 'denied'.
      result.error = true;
      result.denied.push({
        state: 'denied',
        descriptor: request.descriptor,
        _ipx: null,
      });
      stateLock.set(request.id, {
        state: 'denied',
        descriptor: request.descriptor,
        _ipx: null,
      });
    });
  }

  return result;
}

export function hasPermission(id: string): boolean {
  if (!stateLock.has(id)) return false;
  return stateLock.get(id)!.state === 'granted';
}

export async function updatePermission(
  id: string,
  options: PermissionRequestOptions,
): Promise<PermissionRequestState> {
  // Attempt to resolve the permission from the locked state.
  const current = resolve(id);

  // Fallback to the default should it be unavailable.
  if (current === undefined || current.descriptor === null) return current!;

  // Attempt to grant the permission.
  const stat =
    (options.request
      ? await Deno.permissions.request(current.descriptor)
      : await Deno.permissions.query(current.descriptor));

  // Throw an error if the state is expected to be granted.
  if (options.require && stat.state !== 'granted') {
    throw new Error(
      'Failed to update the permission state. The permission was either rejected by the user or not provided to Deno.',
    );
  }

  // Update the state.
  current.state = stat.state;
  current._ipx = stat;
  stateLock.set(id, current);

  return current;
}

export async function revokePermission(
  id: string,
): Promise<PermissionRequestState> {
  // Attempt to resolve the permission from the locked state.
  const current = resolve(id);

  // Check if the descriptor is valid.
  if (current.descriptor === null) {
    throw new Error(
      'The permission descriptor is null and not possible to revoke.',
    );
  }

  // Attempt to revoke the permission.
  const stat = await Deno.permissions.revoke(current.descriptor);

  // Update the state.
  current.state = stat.state;
  current._ipx = stat;
  stateLock.set(id, current);

  return current;
}

function resolve(id: string): PermissionRequestState {
  // Attempt to resolve the permission from the locked state.
  const request = stateLock.get(id);

  // Fallback to a prompt null default if not available.
  if (request === undefined || request.descriptor === null) {
    return {
      state: 'prompt',
      descriptor: request?.descriptor ?? null,
      _ipx: request?._ipx ?? null,
    };
  }

  // Return the requested state.
  return request;
}

// Interface definitions.
export interface PermissionRequestGroup {
  id: string;
  descriptor: Deno.PermissionDescriptor;
}

export interface PermissionRequestOptions {
  request: boolean;
  require: boolean;
}

interface PermissionRequestState {
  state: 'granted' | 'prompt' | 'denied';
  descriptor: Deno.PermissionDescriptor | null;
  _ipx: Deno.PermissionStatus | null;
}

interface PermissionRequestResult {
  error: boolean;
  granted: PermissionRequestState[];
  denied: PermissionRequestState[];
}
