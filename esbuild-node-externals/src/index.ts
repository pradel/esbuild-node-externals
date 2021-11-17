import { Plugin } from 'esbuild';
import { findPackagePaths, findDependencies } from './utils';

export interface Options {
  packagePath?: string | string[];
  dependencies?: boolean;
  devDependencies?: boolean;
  peerDependencies?: boolean;
  optionalDependencies?: boolean;
  allowList?: string[];
}

export const nodeExternalsPlugin = (paramsOptions: Options = {}): Plugin => {
  const options = {
    dependencies: true,
    devDependencies: true,
    peerDependencies: true,
    optionalDependencies: true,
    allowList: [] as string[],
    ...paramsOptions,
    packagePath:
      paramsOptions.packagePath && typeof paramsOptions.packagePath === 'string'
        ? [paramsOptions.packagePath]
        : (paramsOptions.packagePath as string[] | undefined),
  };

  const nodeModules = findDependencies({
    packagePaths: options.packagePath
      ? options.packagePath
      : findPackagePaths(),
    dependencies: options.dependencies,
    devDependencies: options.devDependencies,
    peerDependencies: options.peerDependencies,
    optionalDependencies: options.optionalDependencies,
    allowList: options.allowList,
  });

  return {
    name: 'node-externals',
    setup(build) {
      // On every module resolved, we check if the module name should be an external
      build.onResolve({ namespace: 'file', filter: /.*/ }, (args) => {
        // To allow allowList to target sub imports
        if (options.allowList.includes(args.path)) {
          return null;
        }

        // To allow sub imports from packages we take only the first path to deduct the name
        let moduleName = args.path.split('/')[0];

        // In case of scoped package
        if (args.path.startsWith('@')) {
          const split = args.path.split('/');
          moduleName = `${split[0]}/${split[1]}`;
        }

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
