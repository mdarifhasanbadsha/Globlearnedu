import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Globlearn Education",
  description:
    "The terms that apply when you use Globlearn Education's website and counselling services.",
};

const UPDATED = "20 October 2026";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-[#1B3A6B]">Terms of Service</h1>
      <p className="text-sm text-slate-500 mt-2">Last updated: {UPDATED}</p>

      <div className="mt-8 space-y-8 text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">1. What we do</h2>
          <p>
            Globlearn Education provides educational counselling and application assistance for
            students who wish to study in China. We are a consultancy. We are not a university and we
            do not award degrees, scholarships or visas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">2. Important limits</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Admission decisions</strong> are made solely by the universities. We cannot
              guarantee admission to any program.
            </li>
            <li>
              <strong>Scholarship decisions</strong> are made by the awarding body, such as the China
              Scholarship Council or the university. We cannot guarantee funding.
            </li>
            <li>
              <strong>Visa decisions</strong> are made by the Chinese Embassy or Consulate. We provide
              guidance only, and cannot guarantee a visa.
            </li>
            <li>
              Fees, deadlines and program details are those published by universities and may change
              without notice. Always confirm before making a payment.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">3. Accuracy of information</h2>
          <p>
            We work to keep university and fee information accurate and current, and we mark details
            that still need verification. You should treat any fee or deadline as indicative until a
            counsellor confirms it for your specific case.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">4. Using our chat and services</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Provide accurate information about yourself. False documents are not acceptable and will end our service.</li>
            <li>Do not use our chat to abuse, spam, threaten or mislead.</li>
            <li>
              Our messaging may be assisted by an AI system. A human counsellor can take over at any
              time if you ask.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">5. Fees and payments</h2>
          <p>
            Any service charge is quoted to you before you commit. Payments made directly to a
            university are governed by that university&rsquo;s own terms and refund policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">6. Your documents</h2>
          <p>
            You keep ownership of your documents and personal data. We use them only to help with your
            application. You can ask us to delete them at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">7. Liability</h2>
          <p>
            We are responsible for the quality of our counselling and the care we take with your
            application. We are not responsible for decisions made by universities, scholarship bodies
            or embassies, or for delays caused by them.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">8. Privacy</h2>
          <p>
            How we handle your data is described in our{" "}
            <Link href="/privacy" className="text-[#C8102E] font-medium hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">9. Changes</h2>
          <p>We may update these terms. The date at the top shows the current version.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">10. Contact</h2>
          <p>
            Globlearn Education, Dhaka, Bangladesh
            <br />
            Email:{" "}
            <a href="mailto:info@globlearnedu.com" className="text-[#C8102E] font-medium hover:underline">
              info@globlearnedu.com
            </a>
            <br />
            WhatsApp:{" "}
            <a
              href="https://wa.me/8615655031556"
              className="text-[#C8102E] font-medium hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              +86 156 5503 1556
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
