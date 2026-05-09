export type Direction = "up" | "down" | "left" | "right";

export interface Rect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface FocusNode {
  id: string;
  rect: Rect;
  disabled?: boolean;
}

function getCenter(rect: Rect) {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}

function isVisible(rect: Rect) {
  return rect.width > 0 && rect.height > 0;
}

function isAhead(origin: Rect, rect: Rect, direction: Direction) {
  if (direction === "up") return rect.bottom <= origin.top;
  if (direction === "down") return rect.top >= origin.bottom;
  if (direction === "left") return rect.right <= origin.left;
  return rect.left >= origin.right;
}

function scoreNode(origin: Rect, rect: Rect, direction: Direction) {
  const current = getCenter(origin);
  const next = getCenter(rect);
  const dx = Math.abs(next.x - current.x);
  const dy = Math.abs(next.y - current.y);
  const primary = direction === "left" || direction === "right" ? dx : dy;
  const secondary = direction === "left" || direction === "right" ? dy : dx;
  return primary * 10 + secondary * 2;
}

export function findCandidate(nodes: FocusNode[], current: string, direction: Direction) {
  const origin = nodes.find((node) => node.id === current);
  if (!origin) return null;

  const candidates = nodes.filter((node) => {
    if (node.id === current || node.disabled) return false;
    if (!isVisible(node.rect)) return false;
    return isAhead(origin.rect, node.rect, direction);
  });

  candidates.sort(
    (a, b) => scoreNode(origin.rect, a.rect, direction) - scoreNode(origin.rect, b.rect, direction)
  );
  return candidates[0] ?? null;
}
