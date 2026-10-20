// ─────────────────────────────────────────────────────────────
// Channel connection registry.
// Every channel is declared here with what it actually needs.
// A channel is only "connected" when a live check passes — never
// because a button was clicked.
// ─────────────────────────────────────────────────────────────

export interface ChannelSpec {
  key: string;
  label: string;
  icon: string;
  description: string;
  /** Env var names that must be set for the OAuth flow to start. */
  requiredEnv: string[];
  /** How the owner can wire it up without OAuth. */
  manualFields: { key: string; label: string; placeholder?: string; secret?: boolean }[];
  docsUrl: string;
  /** Honest state: what blocks a live connection today. */
  blocker: string | null;
}

export const CHANNELS: ChannelSpec[] = [
  {
    key: "facebook",
    label: "Facebook Page",
    icon: "f",
    description: "Read and reply to messages sent to your Facebook Page.",
    requiredEnv: ["META_APP_ID", "META_APP_SECRET"],
    manualFields: [
      { key: "pageId", label: "Page ID" },
      { key: "pageAccessToken", label: "Page Access Token", secret: true },
    ],
    docsUrl: "https://developers.facebook.com/docs/messenger-platform",
    blocker:
      "Requires a Meta app with the pages_messaging permission approved. Until then Meta refuses message access even after login.",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: "◎",
    description: "Read and reply to Instagram Direct messages.",
    requiredEnv: ["META_APP_ID", "META_APP_SECRET"],
    manualFields: [
      { key: "igUserId", label: "Instagram Business User ID" },
      { key: "pageAccessToken", label: "Page Access Token", secret: true },
    ],
    docsUrl: "https://developers.facebook.com/docs/instagram-platform",
    blocker:
      "Requires an Instagram Business account linked to a Page, plus instagram_manage_messages approval.",
  },
  {
    key: "whatsapp",
    label: "WhatsApp Business",
    icon: "✆",
    description: "Automated replies on your WhatsApp Business number.",
    requiredEnv: ["META_APP_ID", "META_APP_SECRET"],
    manualFields: [
      { key: "phoneNumberId", label: "Phone Number ID" },
      { key: "wabaId", label: "WhatsApp Business Account ID" },
      { key: "accessToken", label: "Permanent Access Token", secret: true },
    ],
    docsUrl: "https://developers.facebook.com/docs/whatsapp/cloud-api",
    blocker:
      "Requires a dedicated phone number registered to the WhatsApp Cloud API and whatsapp_business_messaging approval. Your existing wa.me link is not automation.",
  },
  {
    key: "website",
    label: "Website chat",
    icon: "◍",
    description: "The chat widget on globlearnedu.com. Works without any external approval.",
    requiredEnv: [],
    manualFields: [],
    docsUrl: "",
    blocker: null,
  },
];

export function getChannel(key: string): ChannelSpec | undefined {
  return CHANNELS.find((c) => c.key === key);
}

export function channelEnvReady(spec: ChannelSpec): boolean {
  return spec.requiredEnv.every((k) => (process.env[k] ?? "").trim().length > 0);
}
