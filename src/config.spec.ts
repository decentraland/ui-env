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

describe('when using a config', () => {
  const { env } = process

  afterEach(() => {
    process.env = env
  })

  describe('and all the envs are defined', () => {
    describe('and the env is Env.DEVELOPMENT', () => {
      describe('and getting value of a variable that exists', () => {
        it('should return the value for that variable for the Env.DEVELOPMENT config', () => {
          process.env.DCL_DEFAULT_ENV = Env.DEVELOPMENT
          config = createConfig(configByEnv)
          expect(config.get('FOO')).toBe('bar-dev')
        })
      })
    })

    describe('and the env is Env.STAGING', () => {
      describe('and getting value of a variable that exists', () => {
        it('should return the value for that variable for the Env.STAGING config', () => {
          process.env.DCL_DEFAULT_ENV = Env.STAGING
          config = createConfig(configByEnv)
          expect(config.get('FOO')).toBe('bar-stg')
        })
      })
    })

    describe('and the env is Env.PRODUCTION', () => {
      describe('and getting value of a variable that exists', () => {
        it('should return the value for that variable for the Env.PRODUCTION config', () => {
          process.env.DCL_DEFAULT_ENV = Env.PRODUCTION
          config = createConfig(configByEnv)
          expect(config.get('FOO')).toBe('bar-prod')
        })
      })
    })

    describe('and getting value of a variable that does not exists', () => {
      it('should return undefined', () => {
        config = createConfig(configByEnv)
        expect(config.get('NON_EXISTENT')).toBe(undefined)
      })

      describe('and and passing a default value', () => {
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
    describe('and getting the value of a variable', () => {
      it('should throw', () => {
        process.env.DCL_DEFAULT_ENV = Env.STAGING
        config = createConfig(configWithMissingEnv)
        expect(() => config.get('FOO')).toThrow()
      })
    })
  })
})
