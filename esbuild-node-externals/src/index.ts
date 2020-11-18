import { Plugin } from 'esbuild';
import { readFromPackageJson } from './utils';

export interface Options {
  fileName?: string;
}

export const nodeExternalsPlugin = (paramsOptions: Options = {}): Plugin => {
  const options = {
    fileName: 'package.json',
    ...paramsOptions,
  };

  const nodeModules = readFromPackageJson(options);

  return {
    name: 'node-externals',
    setup(build) {
      // On every module resolved, we check if the module name should be an external
      build.onResolve({ filter: /.*/ }, (args) => {
        const moduleName = args.path;

        console.log({ moduleName });

        // Mark the module as external so it is not resolved
        if (nodeModules.includes(moduleName)) {
          return { path: args.path, external: true };
        }

        return null;
      });
    },
  };
};

export default nodeExternalsPlugin;
