import { DeskRoot } from "desk-js";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <DeskRoot>{children}</DeskRoot>;
}
