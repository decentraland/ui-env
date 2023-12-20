import { Env } from './env'
import { getEnvFromQueryParam, getEnvFromTLD } from './location'

let location: Location

describe('when getting environment from top level domain', () => {
  describe("and host is 'www.google.com'", () => {
    beforeAll(() => {
      location = { host: 'www.google.com' } as Location
    })

    it('should return null', () => {
      expect(getEnvFromTLD(location)).toBe(null)
    })
  })

  describe("and host is 'localhost'", () => {
    beforeAll(() => {
      location = { host: 'localhost' } as Location
    })

    it('should return null', () => {
      expect(getEnvFromTLD(location)).toBe(null)
    })
  })

  describe("and host is 'builder.decentraland.io'", () => {
    beforeAll(() => {
      location = { host: 'builder.decentraland.io' } as Location
    })

    it('should return Env.DEVELOPMENT', () => {
      expect(getEnvFromTLD(location)).toBe(Env.DEVELOPMENT)
    })
  })

  describe("and host is 'builder.decentraland.zone'", () => {
    beforeAll(() => {
      location = { host: 'builder.decentraland.zone' } as Location
    })

    it('should return Env.DEVELOPMENT', () => {
      expect(getEnvFromTLD(location)).toBe(Env.DEVELOPMENT)
    })
  })

  describe("and host is 'builder.decentraland.today'", () => {
    beforeAll(() => {
      location = { host: 'builder.decentraland.today' } as Location
    })

    it('should return Env.STAGING', () => {
      expect(getEnvFromTLD(location)).toBe(Env.STAGING)
    })
  })

  describe("and host is 'builder.decentraland.net'", () => {
    beforeAll(() => {
      location = { host: 'builder.decentraland.net' } as Location
    })

    it('should return Env.STAGING', () => {
      expect(getEnvFromTLD(location)).toBe(Env.STAGING)
    })
  })

  describe("and host is 'builder.decentraland.org'", () => {
    beforeAll(() => {
      location = { host: 'builder.decentraland.org' } as Location
    })

    it('should return Env.PRODUCTION', () => {
      expect(getEnvFromTLD(location)).toBe(Env.PRODUCTION)
    })
  })

  describe("and host is 'builder.decentraland.co'", () => {
    beforeAll(() => {
      location = { host: 'builder.decentraland.co' } as Location
    })

    it('should return Env.PRODUCTION', () => {
      expect(getEnvFromTLD(location)).toBe(Env.PRODUCTION)
    })
  })
})

describe('when getting environment from query param', () => {
  describe('and query param is not present', () => {
    beforeAll(() => {
      location = { search: '' } as Location
    })

    it('should return null', () => {
      expect(getEnvFromQueryParam(location)).toBe(null)
    })
  })

  describe('and query param is invalid', () => {
    beforeAll(() => {
      location = { search: '?env=invalid' } as Location
    })

    it('should return null', () => {
      expect(getEnvFromQueryParam(location)).toBe(null)
    })
  })

  describe('and query param is "dev"', () => {
    beforeAll(() => {
      location = { search: '?env=dev' } as Location
    })

    it('should return Env.DEVELOPMENT', () => {
      expect(getEnvFromQueryParam(location)).toBe(Env.DEVELOPMENT)
    })
  })

  describe('and query param is "stg"', () => {
    beforeAll(() => {
      location = { search: '?env=stg' } as Location
    })

    it('should return Env.STAGING', () => {
      expect(getEnvFromQueryParam(location)).toBe(Env.STAGING)
    })
  })

  describe('and query param is "prod"', () => {
    beforeAll(() => {
      location = { search: '?env=prod' } as Location
    })

    it('should return Env.PRODUCTION', () => {
      expect(getEnvFromQueryParam(location)).toBe(Env.PRODUCTION)
    })
  })

  describe('and query param is uppercased', () => {
    beforeAll(() => {
      location = { search: '?ENV=PROD' } as Location
    })

    it('should return the same value as if it was lowercased', () => {
      const lowercased = { ...location, search: location.search.toLowerCase() }
      expect(getEnvFromQueryParam(location)).toBe(
        getEnvFromQueryParam(lowercased)
      )
    })
  })
})
