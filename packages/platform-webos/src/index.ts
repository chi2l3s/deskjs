export interface WebosConfig {
  appId: string;
  name: string;
  version: string;
  vendor?: string;
}

export function createWebosInfo(config: WebosConfig) {
  return {
    id: config.appId,
    title: config.name,
    version: config.version,
    vendor: config.vendor ?? "deskjs",
    type: "web",
    main: "index.html"
  };
}

export function getWebosMessage() {
  return "webOS packaging is scaffolded. Install webOS TV CLI, then package .desk/dist/web with generated appinfo.json.";
}
