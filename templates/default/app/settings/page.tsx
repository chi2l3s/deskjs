import { Button, Page, SafeArea } from "desk-js/ui";
import { useTheme } from "desk-js/theme";

export default function SettingsPage() {
  const { resolvedTheme, toggleTheme } = useTheme();
  return (
    <Page>
      <SafeArea>
        <h1 className="text-5xl font-bold">Settings</h1>
        <p className="mt-4 text-2xl text-[rgb(var(--desk-muted))]">
          Current theme: {resolvedTheme}
        </p>
        <div className="mt-8">
          <Button autoFocus onClick={toggleTheme}>
            Toggle theme
          </Button>
        </div>
      </SafeArea>
    </Page>
  );
}
