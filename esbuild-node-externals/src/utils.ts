import path from 'path';
import fs from 'fs';

export type AllowPredicate = (path: string) => boolean;
export type AllowList = (string | RegExp)[] | AllowPredicate;

export const createAllowPredicate = (allowList: AllowList): AllowPredicate => {
  return typeof allowList === 'function'
    ? allowList
    : (path: string) =>
        Boolean(
          allowList.find((pattern) =>
            typeof pattern === 'string' ? path === pattern : pattern.test(path)
          )
        );
};

/**
 * Iterates over package.json file paths recursively found in parent directories, starting from the
 * current working directory. If the current working directory is in a git repository, then package.json
 * files outside the git repository will not be yielded.
 * Inspired by https://github.com/Septh/rollup-plugin-node-externals/blob/f13ee95c6f1f01d8ba2276bf491aac399adc5482/src/dependencies.ts#L18
 */
export const findPackagePaths = (cwd: string = process.cwd()): string[] => {
  const chunks = path.resolve(cwd).split(path.sep);
  const paths = [];

  for (let i = chunks.length; i > 0; i--) {
    const dir = chunks.slice(0, i).join(path.sep);
    const packagePath = path.join(dir, 'package.json');
    const gitPath = path.join(dir, '.git');
    if (fs.statSync(packagePath, { throwIfNoEntry: false })?.isFile()) {
      paths.push(packagePath);
    }
    if (fs.statSync(gitPath, { throwIfNoEntry: false })?.isDirectory()) {
      return paths;
    }
  }

  return paths;
};

function getDependencyKeys(
  map: Record<string, string> = {},
  allowWorkspaces: boolean = false
): string[] {
  if (!map) {
    return [];
  }
  if (!allowWorkspaces) {
    return Object.keys(map);
  }
  // Filter out shared workspaces
  return Object.keys(map).filter(
    (depKey) => !map[depKey].startsWith('workspace:')
  );
}

/**
 * Return an array of the package.json dependencies that should be excluded from the build.
 */
export const findDependencies = (options: {
  packagePaths: string[];
  dependencies: boolean;
  devDependencies: boolean;
  peerDependencies: boolean;
  optionalDependencies: boolean;
  allowPredicate?: AllowPredicate | undefined;
  allowWorkspaces: boolean;
}): string[] => {
  const packageJsonKeys = [
    options.dependencies && 'dependencies',
    options.devDependencies && 'devDependencies',
    options.peerDependencies && 'peerDependencies',
    options.optionalDependencies && 'optionalDependencies',
  ].filter(Boolean) as string[];

  const data = options.packagePaths.map((packagePath) => {
    let packageJson: any;
    try {
      const packageJsonString = fs.readFileSync(packagePath, 'utf8');
      packageJson = JSON.parse(packageJsonString);
    } catch (error) {
      console.error(error);
      throw new Error(
        `Couldn't process ${packagePath}". Make sure it's a valid JSON.`
      );
    }

    const packageNames = packageJsonKeys
      .map((key) =>
        getDependencyKeys(packageJson[key], options.allowWorkspaces)
      )
      .flat(1);
    const { allowPredicate } = options;
    return allowPredicate
      ? packageNames.filter((packageName) => !allowPredicate(packageName))
      : packageNames;
  });

  return data.flat(1);
};
