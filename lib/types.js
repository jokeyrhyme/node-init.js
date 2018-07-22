/* @flow */
'use strict';

/* ::
export type Flags = {
  checkGitStatus: boolean,
  scope: string
}

export type JSONUpdater = (obj: Object) => Promise<Object>

export type NodejsVersion = {
  version: string
}

export type PackageJSONDependencies = {
  [id: string]: string,
}
export type PackageJSONEngines = {
  nodejs?: string,
  npm?: string,
}
export type PackageJSON = {
  dependencies?: PackageJSONDependencies,
  devDependencies?: PackageJSONDependencies,
  engines?: PackageJSONEngines,
  name: string,
  optionalDependencies?: PackageJSONDependencies,
  peerDependencies?: PackageJSONDependencies,
  private?: boolean,
  scripts?: { [id: string]: string },
  version?: string
}

export type ReactProjectData = {
  expected: boolean,
  pkg: PackageJSON
}

export type TaskOptions = {
  cwd: string,
  isFlowProject?: boolean,
  scope: string
}
export type Task = {
  fn(options: TaskOptions): Promise<any>,
  isNeeded?: (options: TaskOptions) => Promise<boolean>,

  id: string,
  label: string,
  provides?: string[],
  requires?: string[],
  settles?: string[]
}
*/

