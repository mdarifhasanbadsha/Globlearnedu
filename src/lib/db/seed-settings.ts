import { db } from "./index";
import { settings } from "./schema";

async function seed() {
  await db.insert(settings).values([
  // Payment QR codes
  { key: "alipay_qr_url", value: "https://pub-1805c1d6eed7442688af0b5b475bb420.r2.dev/Payment%20Codes/1853b3a3a242c66bdc26b2cbe2205551.jpg", label: "Alipay QR Code URL", category: "payment" },
  { key: "wechat_qr_url", value: "https://pub-1805c1d6eed7442688af0b5b475bb420.r2.dev/Payment%20Codes/b42dfb5f73bcbe050221c1c68e78198b.jpg", label: "WeChat Pay QR Code URL", category: "payment" },
  { key: "bank_transfer_enabled", value: "false", label: "Bank transfer enabled", category: "payment" },
  { key: "bank_name", value: "", label: "Bank name", category: "payment" },
  { key: "bank_account_number", value: "", label: "Account number", category: "payment" },
  { key: "bank_account_name", value: "Globlearn Education", label: "Account name", category: "payment" },
  { key: "bank_swift", value: "", label: "SWIFT/BIC code", category: "payment" },
  // Contact
  { key: "whatsapp_number", value: "8615655031556", label: "WhatsApp number", category: "contact" },
  { key: "wechat_id", value: "", label: "WeChat ID", category: "contact" },
  { key: "support_email", value: "info@globlearnedu.com", label: "Support email", category: "contact" },
  // Application
  { key: "deposit_amount", value: "500", label: "Application deposit (CNY)", category: "application" },
  { key: "max_universities_per_application", value: "5", label: "Max universities per application", category: "application" },
  // SEO
  { key: "google_analytics_id", value: "", label: "Google Analytics ID", category: "seo" },
  { key: "google_search_console_id", value: "", label: "Google Search Console verification", category: "seo" },
  ]).onConflictDoNothing();

  console.log("Settings seeded successfully.");
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
