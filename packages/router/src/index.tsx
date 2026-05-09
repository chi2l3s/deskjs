import {
  createContext,
  createElement,
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type ComponentType,
  type ReactNode
} from "react";
import { matchRoute, type RouteManifest } from "./match";

export { matchRoute, type RouteManifest, type RouteRecord } from "./match";

interface RouterState {
  path: string;
  params: Record<string, string>;
  push: (path: string) => void;
  back: () => void;
}

interface ClientRoute {
  id: string;
  path: string;
  page: () => Promise<{ default: ComponentType }>;
  layouts?: Array<() => Promise<{ default: ComponentType<{ children: ReactNode }> }>>;
}

export type ClientManifest = ClientRoute[];

const RouterContext = createContext<RouterState | null>(null);

function getPath() {
  if (typeof window === "undefined") return "/";
  return window.location.pathname || "/";
}

function loadTree(route: ClientRoute, children: ReactNode) {
  const layouts = route.layouts ?? [];
  return layouts.reduceRight((child, loader) => {
    const Layout = lazy(loader);
    return createElement(Layout, null, child);
  }, children);
}

export function RouterProvider({
  children,
  manifest = []
}: {
  children?: ReactNode;
  manifest?: ClientManifest | RouteManifest;
}) {
  const [path, setPath] = useState(getPath);
  const match = matchRoute(manifest as RouteManifest, path);
  const params = match?.params ?? {};

  useEffect(() => {
    const update = () => setPath(getPath());
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  const push = useCallback((next: string) => {
    window.history.pushState({}, "", next);
    setPath(getPath());
  }, []);

  const back = useCallback(() => {
    window.history.back();
  }, []);

  const value = useMemo(() => ({ path, params, push, back }), [path, params, push, back]);
  const page = match?.route as ClientRoute | undefined;

  if (!page || typeof page.page !== "function") {
    return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
  }

  const Page = lazy(page.page);
  const tree = loadTree(page, <Page />);

  return (
    <RouterContext.Provider value={value}>
      <Suspense fallback={<div data-desk-loading>Loading...</div>}>{tree}</Suspense>
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const value = useContext(RouterContext);
  if (!value) throw new Error("useRouter must be used inside RouterProvider.");
  return value;
}

export function useParams() {
  return useRouter().params;
}

export function Link({
  href,
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const router = useRouter();
  return (
    <a
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        router.push(href);
      }}
      {...props}
    />
  );
}
