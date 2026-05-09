import { DeskRoot } from "deskjs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <DeskRoot>{children}</DeskRoot>;
}
