import type { Plugin } from 'esbuild';

import {
  findPackagePaths,
  findDependencies,
  AllowList,
  createAllowPredicate,
} from './utils';

export interface Options {
  packagePath?: string | string[];
  dependencies?: boolean;
  devDependencies?: boolean;
  peerDependencies?: boolean;
  optionalDependencies?: boolean;
  allowList?: AllowList;
  allowWorkspaces?: boolean;
  cwd?: string;
}

const foundPackagePaths: Map<string, string[]> = new Map();
const findPackagePathsMemoized = (cwd: string): string[] => {
  if (foundPackagePaths.has(cwd)) {
    return foundPackagePaths.get(cwd)!;
  }

  foundPackagePaths.set(cwd, findPackagePaths(cwd));
  return findPackagePathsMemoized(cwd);
};

export const nodeExternalsPlugin = (paramsOptions: Options = {}): Plugin => {
  const options = {
    dependencies: true,
    devDependencies: true,
    peerDependencies: true,
    optionalDependencies: true,
    allowWorkspaces: false,
    ...paramsOptions,
    packagePath:
      paramsOptions.packagePath && typeof paramsOptions.packagePath === 'string'
        ? [paramsOptions.packagePath]
        : (paramsOptions.packagePath as string[] | undefined),
  };

  const allowPredicate =
    options.allowList && createAllowPredicate(options.allowList);


  return {
    name: 'node-externals',
    setup(build) {
      const cwd = options.cwd || build.initialOptions.absWorkingDir || process.cwd()
      const nodeModules = findDependencies({
        packagePaths: options.packagePath
          ? options.packagePath
          : findPackagePathsMemoized(cwd),
        dependencies: options.dependencies,
        devDependencies: options.devDependencies,
        peerDependencies: options.peerDependencies,
        optionalDependencies: options.optionalDependencies,
        allowPredicate,
        allowWorkspaces: options.allowWorkspaces,
      });
      // On every module resolved, we check if the module name should be an external
      build.onResolve({ namespace: 'file', filter: /.*/ }, (args) => {
        // To allow allowList to target sub imports
        if (allowPredicate?.(args.path)) {
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
