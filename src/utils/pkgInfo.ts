import pkginfo from 'pkginfo';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pkgInfo(prop: string): any {
  const exposedProps = ['version'];

  pkginfo(module, ...exposedProps);

  if (!exposedProps.includes(prop)) {
    throw new Error(`As currently configured, pkgInfo does not grant access to the '${prop}' of package.json.`)
  }
  return module.exports[prop];
}
