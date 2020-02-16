import { getOrDefault } from '../common/object/getOrDefault';
import { DependencyMap, readPackageFile } from './readPackageFile';

type DependencySection = (
  'dependencies' |
  'devDependencies' |
  'peerDependencies' |
  'optionalDependencies'
);

type GetDependenciesByNamesOptions = {
  pathToPackageFile?: string;
  dependencySection?: DependencySection;
}


/* Given a list of dependency names, return the full  */
export function getDependenciesByNames(
  dependencyNames: string[],
  options: GetDependenciesByNamesOptions = {},
): DependencyMap {
  const {
    pathToPackageFile: pathToFile,
    dependencySection = 'dependencies',
  } = options;
  const dependencies = readPackageFile(pathToFile)[dependencySection] as { [key: string]: string };
  return dependencyNames.reduce((map, dependencyName) => ({
    ...map,
    ... { [dependencyName]: getOrDefault(dependencies, dependencyName)},
  }), {});
}
