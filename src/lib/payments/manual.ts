import { getSetting } from "@/lib/settings";

export async function getPaymentConfig() {
  const [alipayQr, wechatQr, bankEnabled, bankName, bankAccount, bankAccountName, bankSwift, depositAmount] =
    await Promise.all([
      getSetting("alipay_qr_url"),
      getSetting("wechat_qr_url"),
      getSetting("bank_transfer_enabled"),
      getSetting("bank_name"),
      getSetting("bank_account_number"),
      getSetting("bank_account_name"),
      getSetting("bank_swift"),
      getSetting("deposit_amount"),
    ]);

  return {
    alipayQrUrl: alipayQr || "",
    wechatQrUrl: wechatQr || "",
    bankEnabled: bankEnabled === "true",
    bankName: bankName || "",
    bankAccount: bankAccount || "",
    bankAccountName: bankAccountName || "Globlearn Education",
    bankSwift: bankSwift || "",
    depositAmount: parseInt(depositAmount || "500"),
  };
}

export type PaymentConfig = Awaited<ReturnType<typeof getPaymentConfig>>;
