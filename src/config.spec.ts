import { ConfigByEnv, createConfig, IConfig } from './config'
import { Env } from './env'

let config: IConfig

const configByEnv: ConfigByEnv = {
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

describe('when geting using a config', () => {
  const { env } = process

  afterEach(() => {
    process.env = env
  })

  describe('and getting a variable', () => {
    describe('and all the envs are defined', () => {
      describe('and the env is Env.DEVELOPMENT', () => {
        describe('and the variable exists', () => {
          it('should return the value for that variable for the Env.DEVELOPMENT config', () => {
            process.env.DCL_DEFAULT_ENV = Env.DEVELOPMENT
            config = createConfig(configByEnv)
            expect(config.get('FOO')).toBe('bar-dev')
          })
        })
      })

      describe('and the env is Env.STAGING', () => {
        describe('and the variable exists', () => {
          it('should return the value for that variable for the Env.STAGING config', () => {
            process.env.DCL_DEFAULT_ENV = Env.STAGING
            config = createConfig(configByEnv)
            expect(config.get('FOO')).toBe('bar-stg')
          })
        })
      })

      describe('and the env is Env.PRODUCTION', () => {
        describe('and the variable exists', () => {
          it('should return the value for that variable for the Env.PRODUCTION config', () => {
            process.env.DCL_DEFAULT_ENV = Env.PRODUCTION
            config = createConfig(configByEnv)
            expect(config.get('FOO')).toBe('bar-prod')
          })
        })
      })

      describe('and the variable does not exist', () => {
        it('should return undefined', () => {
          config = createConfig(configByEnv)
          expect(config.get('NON_EXISTENT')).toBe(undefined)
        })

        describe('and passing a default value', () => {
          it('should return the default value', () => {
            config = createConfig(configByEnv)
            expect(config.get('NON_EXISTENT', 'someDefaultValue')).toBe(
              'someDefaultValue'
            )
          })
        })
      })
    })

    describe('and an env is missing', () => {
      const { stg: _, ...configWithMissingEnv } = configByEnv
      it('should throw', () => {
        process.env.DCL_DEFAULT_ENV = Env.STAGING
        config = createConfig(configWithMissingEnv)
        expect(() => config.get('FOO')).toThrow()
      })
    })
  })

  describe('and getting the env', () => {
    it('should return the env currently used by the config', () => {
      process.env.DCL_DEFAULT_ENV = Env.STAGING
      config = createConfig(configByEnv)
      expect(config.getEnv()).toBe(Env.STAGING)
    })
  })

  describe('and checking if a given env is the current one', () => {
    it('should return true if the given env is the current one', () => {
      process.env.DCL_DEFAULT_ENV = Env.STAGING
      config = createConfig(configByEnv)
      expect(config.is(Env.STAGING)).toBe(true)
    })
    it('should return false if the given env is not the current one', () => {
      process.env.DCL_DEFAULT_ENV = Env.STAGING
      config = createConfig(configByEnv)
      expect(config.is(Env.DEVELOPMENT)).toBe(false)
      expect(config.is(Env.PRODUCTION)).toBe(false)
    })
  })
})
