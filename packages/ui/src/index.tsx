import {
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode
} from "react";
import { FocusScope, useFocusable } from "@deskjs/focus";
import { Link } from "@deskjs/router";
import { cn, getId } from "./utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-indigo-500 text-white data-[focused]:bg-indigo-400",
  secondary: "bg-white/10 text-[rgb(var(--desk-fg))] data-[focused]:bg-white/20",
  ghost: "bg-transparent text-[rgb(var(--desk-fg))] data-[focused]:bg-white/10",
  danger: "bg-red-600 text-white data-[focused]:bg-red-500"
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-xl"
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  autoFocus?: boolean;
  variant?: Variant;
  size?: Size;
}

export function Button({
  autoFocus,
  className,
  disabled,
  id,
  onClick,
  size = "md",
  variant = "primary",
  ...props
}: ButtonProps) {
  const itemId = useMemo(() => getId("button", id), [id]);
  const { ref, focusProps } = useFocusable({
    id: itemId,
    autoFocus,
    disabled,
    onEnter: () => onClick?.({} as never)
  });

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-lg font-semibold outline-none transition duration-150 data-[focused]:scale-105 data-[focused]:ring-4 data-[focused]:ring-indigo-300/80 disabled:opacity-40",
        variants[variant],
        sizes[size],
        className
      )}
      {...focusProps}
      {...props}
    />
  );
}

export function IconButton(props: ButtonProps) {
  return <Button {...props} className={cn("aspect-square px-4", props.className)} />;
}

export function Hero({
  actions,
  background,
  description,
  subtitle,
  title
}: {
  actions?: ReactNode;
  background?: string;
  description?: string;
  subtitle?: string;
  title: string;
}) {
  return (
    <section className="relative min-h-[58vh] overflow-hidden px-16 py-20">
      {background ? (
        <img alt="" className="absolute inset-0 h-full w-full object-cover" src={background} />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--desk-bg))] via-[rgb(var(--desk-bg)/0.86)] to-transparent" />
      <div className="relative max-w-3xl pt-16">
        <p className="text-xl text-[rgb(var(--desk-muted))]">{subtitle}</p>
        <h1 className="mt-3 text-7xl font-black tracking-normal">{title}</h1>
        {description ? (
          <p className="mt-6 text-2xl leading-9 text-[rgb(var(--desk-fg)/0.82)]">{description}</p>
        ) : null}
        {actions ? <div className="mt-10 flex gap-4">{actions}</div> : null}
      </div>
    </section>
  );
}

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main
      className={cn("min-h-screen bg-[rgb(var(--desk-bg))] text-[rgb(var(--desk-fg))]", className)}
    >
      {children}
    </main>
  );
}

export function SafeArea({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-16 py-10", className)}>{children}</div>;
}

export function Row({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <section className="py-6">
      {title ? <h2 className="mb-5 px-16 text-3xl font-bold">{title}</h2> : null}
      <div className="flex gap-6 overflow-x-auto px-16 pb-6">{children}</div>
    </section>
  );
}

export function Grid({
  children,
  columns = 5,
  gap = 24
}: {
  children: ReactNode;
  columns?: number;
  gap?: number;
}) {
  return (
    <div
      className="grid px-16"
      style={{
        gap,
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
      }}
    >
      {children}
    </div>
  );
}

export function Poster({ href, image, title }: { href?: string; image: string; title: string }) {
  const id = useMemo(() => getId("poster", href ?? title), [href, title]);
  const { ref, focusProps } = useFocusable({
    id,
    onEnter: () => href && history.pushState({}, "", href)
  });
  const body = (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      className="w-56 shrink-0 rounded-lg bg-[rgb(var(--desk-card))] outline-none transition duration-150 data-[focused]:scale-105 data-[focused]:ring-4 data-[focused]:ring-indigo-300"
      {...focusProps}
    >
      <img alt="" className="aspect-[2/3] w-full rounded-t-lg object-cover" src={image} />
      <h3 className="truncate p-4 text-xl font-semibold">{title}</h3>
    </article>
  );

  if (!href) return body;
  return (
    <Link aria-label={title} href={href} className="outline-none">
      {body}
    </Link>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-lg bg-[rgb(var(--desk-card))] p-6", className)}>{children}</div>
  );
}

export function Tabs({ tabs }: { tabs: Array<{ id: string; label: string; content: ReactNode }> }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const tab = tabs.find((item) => item.id === active);
  return (
    <div>
      <div className="flex gap-3">
        {tabs.map((item) => (
          <Button
            key={item.id}
            variant={item.id === active ? "primary" : "ghost"}
            onClick={() => setActive(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className="mt-8">{tab?.content}</div>
    </div>
  );
}

export function Sidebar({ children }: { children: ReactNode }) {
  return <aside className="w-72 shrink-0 border-r border-white/10 p-6">{children}</aside>;
}

export function Modal({ children, open }: { children: ReactNode; open: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70">
      <FocusScope>
        <div className="w-[min(720px,90vw)] rounded-lg bg-[rgb(var(--desk-card))] p-8 shadow-2xl">
          {children}
        </div>
      </FocusScope>
    </div>
  );
}

export const Dialog = Modal;

export function Toast({ children }: { children: ReactNode }) {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 rounded-lg bg-[rgb(var(--desk-card))] px-6 py-4">
      {children}
    </div>
  );
}

export function Spinner() {
  return (
    <div
      aria-label="Loading"
      className="size-12 animate-spin rounded-full border-4 border-white/20 border-t-indigo-400"
    />
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "rounded-lg bg-[rgb(var(--desk-card))] px-5 py-4 text-xl outline-none focus:ring-4 focus:ring-indigo-300",
        props.className
      )}
    />
  );
}

export function Keyboard({ onKey }: { onKey: (key: string) => void }) {
  const keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
  return (
    <Grid columns={9} gap={12}>
      {keys.map((key) => (
        <Button key={key} variant="secondary" onClick={() => onKey(key)}>
          {key}
        </Button>
      ))}
    </Grid>
  );
}
