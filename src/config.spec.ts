import { ConfigByEnv, createConfig, IConfig } from './config'
import { Env, EnvironmentVariables } from './env'

let config: IConfig

let configByEnv: ConfigByEnv

describe('when using a config', () => {
  const { env } = process

  afterEach(() => {
    process.env = env
  })

  describe('and getting a variable', () => {
    describe('and all the envs are defined', () => {
      beforeEach(() => {
        configByEnv = {
          [Env.DEVELOPMENT]: {
            FOO: 'bar-dev',
          },
          [Env.STAGING]: {
            FOO: 'bar-stg',
          },
          [Env.PRODUCTION]: {
            FOO: 'bar-prod',
          },
        }
      })

      describe.each([Env.DEVELOPMENT, Env.STAGING, Env.PRODUCTION])(
        'and the env is %s',
        (environment: string) => {
          beforeEach(() => {
            process.env.DCL_DEFAULT_ENV = environment
          })

          describe('and the variable exists', () => {
            it(`should return the value for that variable for the ${environment} config`, () => {
              expect(createConfig(configByEnv).get('FOO')).toBe(
                `bar-${environment}`
              )
            })
          })

          describe('and the variable does not exist', () => {
            let nonExistentVariable: string
            let defaultValue: string | undefined

            beforeEach(() => {
              nonExistentVariable = 'NON_EXISTENT'
            })

            describe("and there's no default value", () => {
              beforeEach(() => {
                defaultValue = undefined
              })

              it('should return empty string', () => {
                expect(
                  createConfig(configByEnv).get(
                    nonExistentVariable,
                    defaultValue
                  )
                ).toBe('')
              })
            })

            describe("and there's a default value", () => {
              beforeEach(() => {
                defaultValue = 'someDefaultValue'
              })

              it('should return the default value', () => {
                expect(
                  createConfig(configByEnv).get(
                    nonExistentVariable,
                    defaultValue
                  )
                ).toBe(defaultValue)
              })
            })
          })
        }
      )
    })

    describe('and an env is missing', () => {
      beforeEach(() => {
        configByEnv = {
          [Env.DEVELOPMENT]: {
            FOO: 'bar-dev',
          },
          [Env.PRODUCTION]: {
            FOO: 'bar-prod',
          },
        }
        process.env.DCL_DEFAULT_ENV = Env.STAGING
      })

      it('should throw when retrieving an environment variable', () => {
        config = createConfig(configByEnv)
        expect(() => config.get('FOO')).toThrow()
      })
    })
  })

  describe('and getting the env', () => {
    beforeEach(() => {
      configByEnv = {
        [Env.DEVELOPMENT]: {
          FOO: 'bar-dev',
        },
        [Env.STAGING]: {
          FOO: 'bar-stg',
        },
        [Env.PRODUCTION]: {
          FOO: 'bar-prod',
        },
      }
    })

    describe('and the default environment is defined in a custom environment variables map', () => {
      let customEnvironment: EnvironmentVariables

      beforeEach(() => {
        customEnvironment = {
          DCL_DEFAULT_ENV: Env.DEVELOPMENT,
        }
      })

      it('should return the env from the custom system environment map', () => {
        config = createConfig(configByEnv, {
          systemEnvVariables: customEnvironment,
        })
        expect(config.getEnv()).toBe(Env.DEVELOPMENT)
      })
    })

    describe('and the default environment is defined in the process.env variable', () => {
      beforeEach(() => {
        process.env.DCL_DEFAULT_ENV = Env.STAGING
      })

      it('should return the env currently used by the config', () => {
        config = createConfig(configByEnv)
        expect(config.getEnv()).toBe(Env.STAGING)
      })
    })
  })

  describe('and checking if a given env is the current one', () => {
    beforeEach(() => {
      configByEnv = {
        [Env.DEVELOPMENT]: {
          FOO: 'bar-dev',
        },
        [Env.STAGING]: {
          FOO: 'bar-stg',
        },
        [Env.PRODUCTION]: {
          FOO: 'bar-prod',
        },
      }
    })

    describe("and it's the current one", () => {
      beforeEach(() => {
        process.env.DCL_DEFAULT_ENV = Env.STAGING
      })

      it('should return true', () => {
        config = createConfig(configByEnv)
        expect(config.is(Env.STAGING)).toBe(true)
      })
    })

    describe("and it's not the current one", () => {
      beforeEach(() => {
        process.env.DCL_DEFAULT_ENV = Env.STAGING
      })

      it('should return false', () => {
        config = createConfig(configByEnv)
        expect(config.is(Env.DEVELOPMENT)).toBe(false)
        expect(config.is(Env.PRODUCTION)).toBe(false)
      })
    })
  })
})
