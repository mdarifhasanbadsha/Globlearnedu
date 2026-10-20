import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import BusinessChatWidget from "@/components/shared/BusinessChatWidget";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-[68px] pb-16 md:pb-0 min-h-screen">{children}</main>
      <Footer />
      <MobileBottomBar />
      {/*
        The floating WhatsApp button used to sit here and overlapped the AI
        chat launcher. The AI assistant is now the single floating contact.
        Inline WhatsApp buttons inside pages and the mobile bottom bar are
        untouched, so a student can still choose WhatsApp deliberately.
      */}
      <BusinessChatWidget />
    </>
  );
}
