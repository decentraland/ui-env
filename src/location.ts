import { Env, isEnv } from './env'

/**
 * A host can be fully qualified with a trailing dot (`decentraland.org.`). That is
 * valid DNS, browsers keep the dot in `location.host`, and every suffix check below
 * then misses. The env resolution falls through to the default, so a visitor on the
 * FQDN gets whatever env the app defaults to instead of the one its domain names.
 */
function normalizeHost(host: string): string {
  return host.endsWith('.') ? host.slice(0, -1) : host
}

/**
 * Returns the Env from the top level domain if possible
 * @param location
 * @returns Env or null
 */
export function getEnvFromTLD(location: Location): Env | null {
  const host = normalizeHost(location.host)

  if (host.endsWith('.org') || host.endsWith('.co')) {
    return Env.PRODUCTION
  } else if (host.endsWith('.today') || host.endsWith('.net')) {
    return Env.STAGING
  } else if (host.endsWith('.io') || host.endsWith('.zone')) {
    return Env.DEVELOPMENT
  }

  return null
}

/**
 * Returns the Env from the query param if possible
 * @param location
 * @returns Env or null
 */
export function getEnvFromQueryParam(location: Location): Env | null {
  const search = new URLSearchParams(location.search)
  const param = search.get('ENV') || search.get('env')

  if (param) {
    const env = param.toLowerCase()
    if (isEnv(env)) {
      return env
    }
  }

  return null
}
