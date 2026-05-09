import { defineConfig } from "deskjs";

export default defineConfig({
  appId: "com.example.myapp",
  name: "My TV App",
  version: "1.0.0",
  theme: {
    defaultTheme: "dark"
  },
  focus: {
    restoreOnBack: true,
    debug: false
  },
  ui: {
    overscanSafeArea: true
  },
  targets: {
    web: true,
    tizen: {
      profile: "tv"
    },
    webos: {
      vendor: "Example Inc."
    },
    android: {
      packageName: "com.example.myapp",
      minSdk: 23
    }
  }
});
