import { Button, Page, SafeArea } from "desk-js/ui";
import { useTheme } from "desk-js/theme";

export default function SettingsPage() {
  const { resolvedTheme, setTheme, toggleTheme } = useTheme();
  return (
    <Page>
      <SafeArea>
        <h1 className="text-5xl font-bold">Settings</h1>
        <p className="mt-4 text-2xl text-[rgb(var(--desk-muted))]">Theme: {resolvedTheme}</p>
        <div className="mt-8 flex gap-4">
          <Button autoFocus onClick={toggleTheme}>
            Toggle
          </Button>
          <Button variant="secondary" onClick={() => setTheme("system")}>
            System
          </Button>
        </div>
      </SafeArea>
    </Page>
  );
}
