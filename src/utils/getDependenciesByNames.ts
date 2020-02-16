import { getOrDefault } from '../common/object/getOrDefault';
import { DependencyMap, readPackageFile } from './readPackageFile';

type GetDependenciesByNamesOptions = {
  pathToPackageFile?: string;
}

/* Given a list of dependency names, return the full  */
export function getDependenciesByNames(
  dependencyNames: string[],
  options: GetDependenciesByNamesOptions = {},
): DependencyMap {
  const { pathToPackageFile: pathToFile } = options;
  const dependencies = readPackageFile(pathToFile).dependencies as { [key: string]: string };
  return dependencyNames.reduce((map, dependencyName) => ({
    ...map,
    ... { [dependencyName]: getOrDefault(dependencies, dependencyName)},
  }), {});
}
