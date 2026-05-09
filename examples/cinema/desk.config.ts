import { defineConfig } from "desk-js";

export default defineConfig({
  appId: "com.deskjs.cinema",
  name: "deskjs Cinema",
  version: "0.1.0",
  theme: {
    defaultTheme: "dark"
  },
  targets: {
    web: true,
    tizen: {
      profile: "tv"
    },
    webos: {
      vendor: "deskjs"
    },
    android: {
      packageName: "com.deskjs.cinema",
      minSdk: 23
    }
  }
});
