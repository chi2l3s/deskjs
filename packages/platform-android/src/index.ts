export interface AndroidConfig {
  appId: string;
  name: string;
  packageName?: string;
  minSdk?: number;
}

export function createAndroidPlan(config: AndroidConfig) {
  return {
    packageName: config.packageName ?? config.appId,
    minSdk: config.minSdk ?? 23,
    strategy: "WebView shell loads bundled deskjs web assets from android_asset/www."
  };
}

export function getAndroidMessage() {
  return "Android is scaffolded around a WebView shell. Install Android SDK before native packaging commands are enabled.";
}
