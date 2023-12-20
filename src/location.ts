import { Env, isEnv } from './env'

/**
 * Returns the Env from the top level domain if possible
 * @param location
 * @returns Env or null
 */
export function getEnvFromTLD(location: Location): Env | null {
  const { host } = location

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
