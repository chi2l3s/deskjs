export interface RouteRecord {
  id: string;
  path: string;
  page: string;
  layouts: string[];
  params: string[];
}

export type RouteManifest = RouteRecord[];

function getPattern(path: string) {
  return `^${path.replace(/:[^/]+/g, "([^/]+)")}$`;
}

export function matchRoute(manifest: RouteManifest, pathname: string) {
  for (const route of manifest) {
    const match = pathname.match(new RegExp(getPattern(route.path)));
    if (!match) continue;
    const params = Object.fromEntries(
      route.params.map((name, i) => [name, decodeURIComponent(match[i + 1])])
    );
    return { route, params };
  }
  return null;
}
