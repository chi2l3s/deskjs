export interface TizenConfig {
  appId: string;
  name: string;
  version: string;
  profile?: string;
}

export function createTizenConfig(config: TizenConfig) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns="http://www.w3.org/ns/widgets" id="${config.appId}" version="${config.version}">
  <name>${config.name}</name>
  <tizen:profile name="${config.profile ?? "tv"}" xmlns:tizen="http://tizen.org/ns/widgets" />
  <content src="index.html" />
</widget>
`;
}

export function getTizenMessage() {
  return "Tizen packaging is scaffolded. Install Tizen Studio CLI, then deskjs can package .desk/dist/web into a TV widget.";
}
