import type { PaymentConfig } from "@/lib/payments/manual";

interface Props {
  paymentConfig: PaymentConfig;
}

export default function PaymentSection({ paymentConfig }: Props) {
  const { alipayQrUrl, wechatQrUrl, bankEnabled, bankName, bankAccount, bankAccountName, bankSwift, depositAmount } = paymentConfig;

  const hasQr = alipayQrUrl || wechatQrUrl;

  if (!hasQr && !bankEnabled) {
    return (
      <div className="rounded-2xl p-5 border text-center" style={{ backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" }}>
        <p className="text-sm" style={{ color: "#64748B" }}>
          Payment instructions are being updated. Please contact your advisor via WhatsApp for payment details.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-black mb-1" style={{ color: "#1B3A6B" }}>How to Pay</h2>
        <p className="text-sm" style={{ color: "#64748B" }}>
          Application deposit: <strong>¥{depositAmount} CNY</strong>. Scan a QR code below or use bank transfer.
        </p>
      </div>

      {hasQr && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {alipayQrUrl && (
            <div className="bg-white rounded-2xl border p-5 flex flex-col items-center gap-3" style={{ borderColor: "#E2E8F0" }}>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#1677FF" }}>Alipay</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={alipayQrUrl}
                alt="Alipay QR code"
                style={{ width: "160px", height: "160px", objectFit: "contain" }}
              />
              <p className="text-xs text-center" style={{ color: "#64748B" }}>
                Scan with Alipay app to pay
              </p>
            </div>
          )}

          {wechatQrUrl && (
            <div className="bg-white rounded-2xl border p-5 flex flex-col items-center gap-3" style={{ borderColor: "#E2E8F0" }}>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#25D366" }}>WeChat Pay</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={wechatQrUrl}
                alt="WeChat Pay QR code"
                style={{ width: "160px", height: "160px", objectFit: "contain" }}
              />
              <p className="text-xs text-center" style={{ color: "#64748B" }}>
                Scan with WeChat to pay
              </p>
            </div>
          )}
        </div>
      )}

      {bankEnabled && bankAccount && (
        <div className="bg-white rounded-2xl border p-5 space-y-3" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-sm font-bold" style={{ color: "#0A1628" }}>Bank Transfer</p>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            {bankName && (
              <>
                <span style={{ color: "#94A3B8" }}>Bank</span>
                <span style={{ color: "#1B3A6B", fontWeight: 600 }}>{bankName}</span>
              </>
            )}
            <span style={{ color: "#94A3B8" }}>Account name</span>
            <span style={{ color: "#1B3A6B", fontWeight: 600 }}>{bankAccountName}</span>
            <span style={{ color: "#94A3B8" }}>Account number</span>
            <span style={{ color: "#1B3A6B", fontWeight: 600, fontFamily: "monospace" }}>{bankAccount}</span>
            {bankSwift && (
              <>
                <span style={{ color: "#94A3B8" }}>SWIFT / BIC</span>
                <span style={{ color: "#1B3A6B", fontWeight: 600, fontFamily: "monospace" }}>{bankSwift}</span>
              </>
            )}
          </div>
          <p className="text-xs" style={{ color: "#94A3B8" }}>
            Include your application number in the payment reference. Send proof of payment to your advisor.
          </p>
        </div>
      )}
    </div>
  );
}
