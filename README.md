# esbuild-node-externals

[![npm version](https://img.shields.io/npm/v/esbuild-node-externals.svg)](https://www.npmjs.com/package/esbuild-node-externals)
[![npm downloads per month](https://img.shields.io/npm/dm/esbuild-node-externals.svg)](https://www.npmjs.com/package/esbuild-node-externals)

[Esbuild](https://github.com/evanw/esbuild) plugin to easily exclude node modules during builds.

When bundling with Esbuild for the backend by default it will try to bundle all the dependencies. However it's a good idea to not bundle all the `node_modules` dependencies. This plugin will scan the dependencies included in your project and will exclude them from the final bundle.

## Installation

This plugin requires minimum **Node.js 12**, and **Esbuild 0.8+**.

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

#### `options.packagePath` (default to `'package.json'`)

Path to your `package.json`. Can be a string or an array of strings for monorepos.

#### `options.dependencies` (default to `true`)

Make package.json `dependencies` external.

#### `options.devDependencies` (default to `true`)

Make package.json `devDependencies` external.

#### `options.peerDependencies` (default to `true`)

Make package.json `peerDependencies` external.

#### `options.optionalDependencies` (default to `true`)

Make package.json `optionalDependencies` external.

## Inspiration

This package and the implementation are inspired by the awesome work of @liady on [webpack-node-externals](https://github.com/liady/webpack-node-externals) for webpack and @Septh on [rollup-plugin-node-externals
](https://github.com/Septh/rollup-plugin-node-externals) for rollup.

## License

MIT © [Léo Pradel](https://www.leopradel.com/)
