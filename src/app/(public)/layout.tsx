import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import FloatingWhatsApp from "@/components/shared/FloatingWhatsApp";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-[68px] pb-16 md:pb-0 min-h-screen">{children}</main>
      <Footer />
      <MobileBottomBar />
      <FloatingWhatsApp />
    </>
  );
}
