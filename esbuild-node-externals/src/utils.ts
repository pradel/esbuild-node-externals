import path from 'path';
import fs from 'fs';

/**
 * Return an array of the package.json dependencies that should be excluded from the build
 */
export const readFromPackageJson = (options: {
  fileName: string;
}): string[] => {
  const packageJsonPath = path.resolve(process.cwd(), options.fileName);
  const packageJsonString = fs.readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonString);

  var packageJsonKeys = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
  ];

  const data = packageJsonKeys
    .map((key) => (packageJson[key] ? Object.keys(packageJson[key]) : []))
    .flat(1);

  return data;
};
