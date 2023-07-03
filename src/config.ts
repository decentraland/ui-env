import { Env, EnvironmentVariables, getEnv } from './env'

export interface IConfig {
  get: (name: string, defaultValue?: string) => string
  is(env: Env): boolean
  getEnv(): Env
}

export type ConfigByEnv = Partial<Record<Env, Record<string, string>>>

/**
 * Creates a config for a UI
 * @param configByEnv - A record of variables for each Env
 * @returns Config
 */
export function createConfig(configByEnv: ConfigByEnv, options?: { systemEnvVariables?: EnvironmentVariables }): IConfig {
  const env = getEnv(options?.systemEnvVariables)
  const config = configByEnv[env]
  return {
    get: (name, defaultValue = '') => {
      if (!config) {
        throw new Error(`Could not find a config for env=${env}`)
      }
      return name in config ? config[name] : defaultValue
    },
    is: (_env: Env) => env === _env,
    getEnv: () => env,
  }
}
