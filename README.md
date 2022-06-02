# ui-env

This package can be used to generate configurations for different environments for web apps and frontends in general. This is handy for frontends that have a single build that is deployed to different envs (such as rollouts).

## Installation

```bash
npm i @dcl/ui-env
```

## Usage

You need to create a `config` instance passing the different variables for all the desired envs.

```js
// config/env/dev|stg|prod.json
{
  "FOO": "bar"
}
```

```ts
// config/index.ts
import { Env, createConfig } from '@dcl/ui-env'
import dev from './env/dev.json'
import stg from './env/stg.json'
import prod from './env/prod.json'

export const config = createConfig({
  [Env.DEVELOPMENT]: dev,
  [Env.STAGING]: stg,
  [Env.PRODUCTION]: prod,
})
```

And then you can get the values for variables from other parts of your code base

```ts
// some-file.ts
import { config } from './config'

const someVar = config.get('FOO') // "bar"
```

You can pass default values as the second argument

```ts
const someVar = config.get('NON_EXISTENT_VAR', 'defaultValue') // "defaultValue"
```

The config will pick the value from the right environment by checking the top level domain:

- `Env.DEVELOPMENT`: If TLD is `.io` or `.zone`
- `Env.STAGING`: If TLD is `.net` or `.today`
- `Env.PRODUCTION`: If TLD is `.org`

You can override this logic by passing a query param `env` with the values `dev`, `stg` or `prod`. The param name and its value can be either uppercase or lowercase.

For example:

- `https://builder.decentraland.io?env=prod`: This will use `Env.PRODUCTION`
- `http://localhost:3000?env=dev`: This will use `Env.DEVELOPMENT`

If no TLD is found and there is no query param, the default environment will be used, which is `Env.PRODUCTION`.

If you want to override the default environment you can use the environment var `DCL_DEFAULT_ENV` or `REACT_APP_DCL_DEFAULT_ENV` and set it with the values `dev`, `stg` or `prod`.

This can be useful to configure the local environment or for deployments to other non-decentraland domains such as Vercel's.

For example:

```bash
# .env
REACT_APP_DCL_DEFAULT_ENV=dev
```

Now `http://localhost:3000` uses the `Env.DEVELOPMENT` configuration without having to pass a query param.

## Test

```bash
npm test
```

Or with coverage reports

```bash
npm run test:coverage
```

## Build

```bash
npm run build
```

## Release

To release a new version of this package create a [new release](https://github.com/decentraland/ui-env/releases) via GitHub
