# esbuild-node-externals

[![npm version](https://img.shields.io/npm/v/esbuild-node-externals.svg)](https://www.npmjs.com/package/esbuild-node-externals)
[![npm downloads per month](https://img.shields.io/npm/dm/esbuild-node-externals.svg)](https://www.npmjs.com/package/esbuild-node-externals)

[Esbuild](https://github.com/evanw/esbuild) plugin to easily exclude node modules during builds.

When bundling with Esbuild for the backend by default it will try to bundle all the dependencies. However it's a good idea to not bundle all the `node_modules` dependencies. This plugin will scan the dependencies included in your project and will exclude them from the final bundle.

## Installation

This plugin requires minimum **Node.js 12**, and **Esbuild 0.12+**.

```sh
# with npm
npm install --save-dev esbuild-node-externals

# with yarn
yarn add --dev esbuild-node-externals
```

## Usage

When you call the esbuild build API, add the esbuild-node-externals plugin.

```js
// Your bundler file
const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  platform: 'node',
  outfile: 'dist/index.js',
  plugins: [nodeExternalsPlugin()],
});
```

## Options

When calling this package, you can pass an `options` object.

```js
// Your bundler file
const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

esbuild.build({
  // ...
  plugins: [
    nodeExternalsPlugin({
      packagePath: 'path/to/package.json',
    }),
  ],
});
```

| Option                 | Description                                                                                                                                        | Default                          |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------|
| `packagePath`          | Path to your `package.json`. Can be a string or an array of strings. If this option is not specified the default behavior is to start with the current directory's package.json then go up scan for all package.json files in parent directories recursively until either the root git directory is reached or until no other package.json can be found. | `undefined`                      |
| `dependencies`         | Make package.json `dependencies` external.                                                                                                         | `true`                           |
| `devDependencies`      | Make package.json `devDependencies` external.                                                                                                      | `true`                           |
| `peerDependencies`     | Make package.json `peerDependencies` external.                                                                                                     | `true`                           |
| `optionalDependencies` | Make package.json `optionalDependencies` external.                                                                                                 | `true`                           |
| `allowList`            | An array for the externals to allow, so they will be included in the bundle.                                                                       | `[]`                             |
| `allowWorkspaces`      | Automatically exclude all packages defined as workspaces (`workspace:*`) in a monorepo.                                                            | `false`                          |
| `cwd`                  | Sets the current working directory for the plugin.                                                                                                 | `buildOptions.absWorkingDir \|\| process.cwd()` |


## Inspiration

This package and the implementation are inspired by the work of @liady on [webpack-node-externals](https://github.com/liady/webpack-node-externals) for webpack and @Septh on [rollup-plugin-node-externals](https://github.com/Septh/rollup-plugin-node-externals) for rollup.

## License

MIT © [Léo Pradel](https://www.leopradel.com/)
