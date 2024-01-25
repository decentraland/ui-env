import {
  Env,
  getDefaultEnv,
  getEnv,
  getEnvList,
  isEnv,
  parseEnvVar,
} from './env'

describe('when getting env list', () => {
  it('should return all values in enum', () => {
    expect(getEnvList()).toEqual(Object.values(Env))
  })
})

describe('when checking if a value is an Env', () => {
  describe('and value is invalid', () => {
    it('should return false', () => {
      expect(isEnv('invalid')).toBe(false)
    })
  })
  describe('and value is valid', () => {
    it('should return true', () => {
      expect(isEnv('dev')).toBe(true)
      expect(isEnv('stg')).toBe(true)
      expect(isEnv('prod')).toBe(true)
    })
  })
})

describe('when parsing an env var', () => {
  describe('and value is invalid', () => {
    it('should throw', () => {
      expect(() => parseEnvVar('invalid')).toThrow()
    })
  })
  describe('and value is valid', () => {
    it('should return the value as an Env', () => {
      expect(parseEnvVar('dev')).toBe(Env.DEVELOPMENT)
      expect(parseEnvVar('stg')).toBe(Env.STAGING)
      expect(parseEnvVar('prod')).toBe(Env.PRODUCTION)
    })
  })
})

describe('when getting default env', () => {
  describe('and no env vars are defined', () => {
    it('should return Env.PRODUCTION', () => {
      expect(getDefaultEnv()).toBe(Env.PRODUCTION)
    })
  })
  describe('and DCL_DEFAULT_ENV is defined', () => {
    describe('and DCL_DEFAULT_ENV is invalid', () => {
      it('should throw', () => {
        expect(() => getDefaultEnv({ DCL_DEFAULT_ENV: 'invalid' })).toThrow()
      })
    })
    describe('and DCL_DEFAULT_ENV is valid', () => {
      it('should return DCL_DEFAULT_ENV as default env', () => {
        expect(getDefaultEnv({ DCL_DEFAULT_ENV: 'dev' })).toBe(Env.DEVELOPMENT)
      })
    })
  })
  describe('and REACT_APP_DCL_DEFAULT_ENV is defined', () => {
    describe('and REACT_APP_DCL_DEFAULT_ENV is invalid', () => {
      it('should throw', () => {
        expect(() =>
          getDefaultEnv({ REACT_APP_DCL_DEFAULT_ENV: 'invalid' })
        ).toThrow()
      })
    })
    describe('and REACT_APP_DCL_DEFAULT_ENV is valid', () => {
      it('should return REACT_APP_DCL_DEFAULT_ENV as default env', () => {
        expect(getDefaultEnv({ REACT_APP_DCL_DEFAULT_ENV: 'dev' })).toBe(
          Env.DEVELOPMENT
        )
      })
    })
    describe('and GATSBY_DCL_DEFAULT_ENV is invalid', () => {
      it('should throw', () => {
        expect(() =>
          getDefaultEnv({ GATSBY_DCL_DEFAULT_ENV: 'invalid' })
        ).toThrow()
      })
    })
    describe('and GATSBY_DCL_DEFAULT_ENV is valid', () => {
      it('should return GATSBY_DCL_DEFAULT_ENV as default env', () => {
        expect(getDefaultEnv({ GATSBY_DCL_DEFAULT_ENV: 'dev' })).toBe(
          Env.DEVELOPMENT
        )
      })
    })
  })
  describe('and VITE_DCL_DEFAULT_ENV is defined', () => {
    describe('and VITE_DCL_DEFAULT_ENV is invalid', () => {
      it('should throw', () => {
        expect(() =>
          getDefaultEnv({ VITE_DCL_DEFAULT_ENV: 'invalid' })
        ).toThrow()
      })
    })
    describe('and VITE_DCL_DEFAULT_ENV is valid', () => {
      it('should return VITE_DCL_DEFAULT_ENV as default env', () => {
        expect(getDefaultEnv({ VITE_DCL_DEFAULT_ENV: 'dev' })).toBe(
          Env.DEVELOPMENT
        )
      })
    })
    describe('and GATSBY_DCL_DEFAULT_ENV is invalid', () => {
      it('should throw', () => {
        expect(() =>
          getDefaultEnv({ GATSBY_DCL_DEFAULT_ENV: 'invalid' })
        ).toThrow()
      })
    })
    describe('and GATSBY_DCL_DEFAULT_ENV is valid', () => {
      it('should return GATSBY_DCL_DEFAULT_ENV as default env', () => {
        expect(getDefaultEnv({ GATSBY_DCL_DEFAULT_ENV: 'dev' })).toBe(
          Env.DEVELOPMENT
        )
      })
    })
  })

  describe('and both DCL_DEFAULT_ENV and REACT_APP_DCL_DEFAULT_ENV are defined', () => {
    describe('and both have the same value', () => {
      it('should return that value as default env', () => {
        expect(
          getDefaultEnv({
            DCL_DEFAULT_ENV: 'dev',
            REACT_APP_DCL_DEFAULT_ENV: 'dev',
          })
        ).toBe(Env.DEVELOPMENT)
      })
    })
    describe('and they have different values', () => {
      it('should throw', () => {
        expect(() =>
          getDefaultEnv({
            DCL_DEFAULT_ENV: 'dev',
            REACT_APP_DCL_DEFAULT_ENV: 'prod',
          })
        ).toThrow()
      })
    })
  })

  describe('and both DCL_DEFAULT_ENV and GATSBY_DCL_DEFAULT_ENV are defined', () => {
    describe('and both have the same value', () => {
      it('should return that value as default env', () => {
        expect(
          getDefaultEnv({
            DCL_DEFAULT_ENV: 'dev',
            GATSBY_DCL_DEFAULT_ENV: 'dev',
          })
        ).toBe(Env.DEVELOPMENT)
      })
    })
    describe('and they have different values', () => {
      it('should throw', () => {
        expect(() =>
          getDefaultEnv({
            DCL_DEFAULT_ENV: 'dev',
            GATSBY_DCL_DEFAULT_ENV: 'prod',
          })
        ).toThrow()
      })
    })
  })

  describe('and both REACT_APP_DCL_DEFAULT_ENV and GATSBY_DCL_DEFAULT_ENV are defined', () => {
    describe('and both have the same value', () => {
      it('should return that value as default env', () => {
        expect(
          getDefaultEnv({
            REACT_APP_DCL_DEFAULT_ENV: 'dev',
            GATSBY_DCL_DEFAULT_ENV: 'dev',
          })
        ).toBe(Env.DEVELOPMENT)
      })
    })
    describe('and they have different values', () => {
      it('should throw', () => {
        expect(() =>
          getDefaultEnv({
            REACT_APP_DCL_DEFAULT_ENV: 'dev',
            GATSBY_DCL_DEFAULT_ENV: 'prod',
          })
        ).toThrow()
      })
    })
  })
})

describe('when getting env', () => {
  let windowSpy: jest.SpyInstance<Window & typeof globalThis, []>
  const { env } = process

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get')
  })

  afterEach(() => {
    windowSpy.mockRestore()
    process.env = env
  })

  function mockLocation(mock: Partial<Location>) {
    const prev = { ...window.location }
    windowSpy.mockImplementation(
      () =>
        ({
          location: { ...prev, ...mock } as Location,
        } as Window & typeof globalThis)
    )
  }

  function mockProcess(mock: Record<string, string | undefined>) {
    const prev = { ...process.env }
    process.env = { ...prev, ...mock }
  }

  describe('and host is "localhost"', () => {
    it('should return Env.PRODUCTION', () => {
      mockLocation({ host: 'localhost' })
      expect(getEnv()).toBe(Env.PRODUCTION)
    })

    describe('and search param is "dev"', () => {
      it('should return Env.DEVELOPMENT', () => {
        mockLocation({ search: '?env=dev' })
        expect(getEnv()).toBe(Env.DEVELOPMENT)
      })
    })

    describe('and the system env variable is "dev"', () => {
      it('should return Env.DEVELOPMENT', () => {
        mockProcess({ DCL_DEFAULT_ENV: 'dev' })
        expect(getEnv()).toBe(Env.DEVELOPMENT)
      })
    })

    describe("and there's a custom system environment variable set to dev", () => {
      it('should return Env.DEVELOPMENT', () => {
        expect(getEnv({ DCL_DEFAULT_ENV: 'dev' })).toBe(Env.DEVELOPMENT)
      })
    })

    describe('and search param is "stg" and the system env variable is "dev"', () => {
      it('should return Env.STAGING', () => {
        mockLocation({ search: '?env=stg' })
        mockProcess({ DCL_DEFAULT_ENV: 'dev' })
        expect(getEnv()).toBe(Env.STAGING)
      })
    })
  })

  describe('and host is "builder.decentraland.zone"', () => {
    it('should return Env.DEVELOPMENT', () => {
      mockLocation({ host: 'builder.decentraland.zone' })
      expect(getEnv()).toBe(Env.DEVELOPMENT)
    })

    describe('and search param is "prod"', () => {
      it('should return Env.PRODUCTION', () => {
        mockLocation({ search: '?env=prod' })
        expect(getEnv()).toBe(Env.PRODUCTION)
      })
    })
  })

  describe('and host is "market.decentraland.org"', () => {
    it('should return Env.PRODUCTION', () => {
      mockLocation({ host: 'builder.decentraland.org' })
      expect(getEnv()).toBe(Env.PRODUCTION)
    })

    describe('and search param is "dev"', () => {
      it('should return Env.DEVELOPMENT', () => {
        mockLocation({ search: '?env=dev' })
        expect(getEnv()).toBe(Env.DEVELOPMENT)
      })
    })
  })
})
