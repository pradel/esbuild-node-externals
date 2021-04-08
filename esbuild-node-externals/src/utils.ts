import path from 'path';
import fs from 'fs';
import findUp from 'find-up';

/**
 * Determines if the `child` path is under the `parent` path.
 */
const isInDirectory = (parent: string, child: string): boolean => {
  const relativePath = path.relative(parent, child);
  return !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
};

const isInGitDirectory = (path: string, gitRootPath?: string): boolean => {
  return gitRootPath === undefined || isInDirectory(gitRootPath, path);
};

/**
 * Iterates over package.json file paths recursively found in parent directories, starting from the
 * current working directory. If the current working directory is in a git repository, then package.json
 * files outside of the git repository will not be yielded.
 * Inspired by https://github.com/Septh/rollup-plugin-node-externals/blob/f13ee95c6f1f01d8ba2276bf491aac399adc5482/src/dependencies.ts#L18
 */
export const findPackagePaths = (): string[] => {
  // Find git root if in git repository
  const gitDirectoryPath = findUp.sync('.git', {
    type: 'directory',
  });
  const gitRootPath: string | undefined =
    gitDirectoryPath === undefined ? undefined : path.dirname(gitDirectoryPath);

  let cwd: string = process.cwd();
  let packagePath: string | undefined;
  const packagePaths: string[] = [];

  while (
    (packagePath = findUp.sync('package.json', { type: 'file', cwd })) &&
    isInGitDirectory(packagePath, gitRootPath)
  ) {
    packagePaths.push(packagePath);
    cwd = path.dirname(path.dirname(packagePath));
  }

  return packagePaths;
};

/**
 * Return an array of the package.json dependencies that should be excluded from the build.
 */
export const findDependencies = (options: {
  packagePaths: string[];
  dependencies: boolean;
  devDependencies: boolean;
  peerDependencies: boolean;
  optionalDependencies: boolean;
  allowList: string[];
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

    return packageJsonKeys
      .map((key) => (packageJson[key] ? Object.keys(packageJson[key]) : []))
      .flat(1)
      .filter((packageName) => !options.allowList.includes(packageName));
  });

  return data.flat(1);
};
