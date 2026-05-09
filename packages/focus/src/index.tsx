import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type RefObject
} from "react";
import { findCandidate, type Direction, type FocusNode } from "./geometry";

export type { Direction, FocusNode, Rect } from "./geometry";

export interface FocusableOptions {
  id: string;
  autoFocus?: boolean;
  disabled?: boolean;
  onEnter?: () => void;
  onBack?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

interface Entry extends FocusableOptions {
  element: HTMLElement;
  route: string;
}

interface Manager {
  focusedId: string | null;
  focus: (id: string) => void;
  move: (direction: Direction) => void;
  register: (entry: Entry) => void;
  unregister: (id: string) => void;
}

const FocusContext = createContext<Manager | null>(null);
const keys: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right"
};

function getRoute() {
  if (typeof window === "undefined") return "/";
  return window.location.pathname;
}

function isHidden(element: HTMLElement) {
  const style = window.getComputedStyle(element);
  return style.visibility === "hidden" || style.display === "none";
}

function buildNodes(entries: Map<string, Entry>) {
  return [...entries.values()].map((entry): FocusNode => {
    const rect = entry.element.getBoundingClientRect();
    return {
      id: entry.id,
      rect,
      disabled: entry.disabled || isHidden(entry.element)
    };
  });
}

export function FocusProvider({
  children,
  debug = false
}: {
  children: ReactNode;
  debug?: boolean;
}) {
  const entries = useRef(new Map<string, Entry>());
  const routeFocus = useRef(new Map<string, string>());
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const focus = useCallback(
    (id: string) => {
      const entry = entries.current.get(id);
      if (!entry || entry.disabled) return;
      entries.current.get(focusedId ?? "")?.onBlur?.();
      entry.element.focus({ preventScroll: true });
      entry.onFocus?.();
      routeFocus.current.set(getRoute(), id);
      setFocusedId(id);
      if (debug) entry.element.dataset.deskFocus = "true";
    },
    [debug, focusedId]
  );

  const move = useCallback(
    (direction: Direction) => {
      if (!focusedId) return;
      const node = findCandidate(buildNodes(entries.current), focusedId, direction);
      if (node) focus(node.id);
    },
    [focus, focusedId]
  );

  const register = useCallback(
    (entry: Entry) => {
      entries.current.set(entry.id, entry);
      const restored = routeFocus.current.get(entry.route);
      if (entry.autoFocus || restored === entry.id || !focusedId)
        queueMicrotask(() => focus(entry.id));
    },
    [focus, focusedId]
  );

  const unregister = useCallback((id: string) => {
    entries.current.delete(id);
    setFocusedId((value) => (value === id ? null : value));
  }, []);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      const direction = keys[event.key];
      if (direction) {
        event.preventDefault();
        move(direction);
        return;
      }

      const entry = entries.current.get(focusedId ?? "");
      if ((event.key === "Enter" || event.key === " ") && entry?.onEnter) {
        event.preventDefault();
        entry.onEnter();
      }

      if (
        (event.key === "Escape" || event.key === "Backspace" || event.key === "BrowserBack") &&
        entry?.onBack
      ) {
        event.preventDefault();
        entry.onBack();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusedId, move]);

  const value = useMemo(
    () => ({ focusedId, focus, move, register, unregister }),
    [focusedId, focus, move, register, unregister]
  );
  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
}

export function useFocusManager() {
  const value = useContext(FocusContext);
  if (!value) throw new Error("useFocusManager must be used inside FocusProvider.");
  return value;
}

export function useFocusable(options: FocusableOptions) {
  const ref = useRef<HTMLElement>(null);
  const manager = useFocusManager();
  const focused = manager.focusedId === options.id;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    manager.register({ ...options, element, route: getRoute() });
    return () => manager.unregister(options.id);
  }, [
    manager,
    options.id,
    options.autoFocus,
    options.disabled,
    options.onEnter,
    options.onBack,
    options.onFocus,
    options.onBlur
  ]);

  return {
    ref: ref as RefObject<HTMLElement>,
    focused,
    focusSelf: () => manager.focus(options.id),
    focusProps: {
      tabIndex: options.disabled ? -1 : 0,
      "data-focused": focused ? "" : undefined,
      onFocus: () => manager.focus(options.id)
    }
  };
}

export function FocusScope({ children }: { children: ReactNode }) {
  return <div data-focus-scope="true">{children}</div>;
}

export function FocusBoundary({ children }: { children: ReactNode }) {
  return <div data-focus-boundary="true">{children}</div>;
}

export function FocusRow({ children }: { children: ReactNode }) {
  return <div data-focus-row="true">{children}</div>;
}

export function FocusGrid({ children }: { children: ReactNode }) {
  return <div data-focus-grid="true">{children}</div>;
}

export function handleFocusKey(event: KeyboardEvent<HTMLElement>, manager: Manager) {
  const direction = keys[event.key];
  if (!direction) return;
  event.preventDefault();
  manager.move(direction);
}
