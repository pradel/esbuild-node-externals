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

## Inspiration

This package and the implementation are highly inspired by the awesome work of @liady on [webpack-node-externals](https://github.com/liady/webpack-node-externals) package made for webpack. I tried to keep the same options name so if you are switching from webpack to esbuild the migration will be easier.

## License

MIT © [Léo Pradel](https://www.leopradel.com/)
