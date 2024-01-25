import { getEnvFromQueryParam, getEnvFromTLD } from './location'

export enum Env {
  DEVELOPMENT = 'dev',
  STAGING = 'stg',
  PRODUCTION = 'prod',
}

export type EnvironmentVariables = Record<string, string | undefined>

/**
 * Returns an array with all the possible envs
 */
export function getEnvList(): Env[] {
  return Object.values(Env)
}

/**
 * Helper to detect if a string value is an Env
 * @param value
 * @returns boolean
 */
export function isEnv(value: string): value is Env {
  return getEnvList().includes(value as Env)
}

/**
 * Helper to convert a string value into an Env type or throw if not valid
 * @param envVar - An environment variable to be parsed
 * @returns - The same envVar value as Env
 */
export function parseEnvVar(envVar: string) {
  if (isEnv(envVar)) {
    return envVar
  } else {
    throw new Error(
      `Invalid value for DCL_DEFAULT_ENV. Found "${envVar}", possible values are ${getEnvList()
        .map((env) => `"${env}"`)
        .join(', ')}.`
    )
  }
}

/**
 * Return the default Env
 * @param envVars - Process environment vars
 * @returns Env
 */
export function getDefaultEnv(
  envVars: Record<string, string | undefined> = {}
): Env {
  const {
    DCL_DEFAULT_ENV,
    REACT_APP_DCL_DEFAULT_ENV,
    VITE_DCL_DEFAULT_ENV,
    GATSBY_DCL_DEFAULT_ENV,
  } = envVars

  if (
    DCL_DEFAULT_ENV &&
    REACT_APP_DCL_DEFAULT_ENV &&
    DCL_DEFAULT_ENV !== REACT_APP_DCL_DEFAULT_ENV
  ) {
    throw new Error(
      'You have defined both DCL_DEFAULT_ENV and REACT_APP_DCL_DEFAULT_ENV with different values'
    )
  }
  if (
    DCL_DEFAULT_ENV &&
    VITE_DCL_DEFAULT_ENV &&
    DCL_DEFAULT_ENV !== VITE_DCL_DEFAULT_ENV
  ) {
    throw new Error(
      'You have defined both DCL_DEFAULT_ENV and VITE_DCL_DEFAULT_ENV with different values'
    )
  }

  if (
    DCL_DEFAULT_ENV &&
    GATSBY_DCL_DEFAULT_ENV &&
    DCL_DEFAULT_ENV !== GATSBY_DCL_DEFAULT_ENV
  ) {
    throw new Error(
      'You have defined both DCL_DEFAULT_ENV and GATSBY_DCL_DEFAULT_ENV with different values'
    )
  }

  if (
    REACT_APP_DCL_DEFAULT_ENV &&
    GATSBY_DCL_DEFAULT_ENV &&
    REACT_APP_DCL_DEFAULT_ENV !== GATSBY_DCL_DEFAULT_ENV
  ) {
    throw new Error(
      'You have defined both REACT_APP_DCL_DEFAULT_ENV and GATSBY_DCL_DEFAULT_ENV with different values'
    )
  }

  if (DCL_DEFAULT_ENV) {
    return parseEnvVar(DCL_DEFAULT_ENV)
  }

  if (REACT_APP_DCL_DEFAULT_ENV) {
    return parseEnvVar(REACT_APP_DCL_DEFAULT_ENV)
  }

  if (VITE_DCL_DEFAULT_ENV) {
    return parseEnvVar(VITE_DCL_DEFAULT_ENV)
  }

  if (GATSBY_DCL_DEFAULT_ENV) {
    return parseEnvVar(GATSBY_DCL_DEFAULT_ENV)
  }

  return Env.PRODUCTION
}

/**
 * Returns the Env to be used
 * @returns Env
 */
export function getEnv(
  systemEnvVariables: EnvironmentVariables = process.env
): Env {
  if (typeof window !== 'undefined') {
    const envFromQueryParam = getEnvFromQueryParam(window.location)
    if (envFromQueryParam) {
      return envFromQueryParam
    }

    const envFromTLD = getEnvFromTLD(window.location)
    if (envFromTLD) {
      return envFromTLD
    }
  }

  return getDefaultEnv(systemEnvVariables)
}
