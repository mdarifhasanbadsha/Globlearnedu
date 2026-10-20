import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Globlearn Education",
  description:
    "How Globlearn Education collects, uses and protects your personal data, including messages sent through our website chat, Messenger, Instagram and WhatsApp.",
};

const UPDATED = "20 October 2026";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-[#1B3A6B]">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mt-2">Last updated: {UPDATED}</p>

      <div className="prose-slate mt-8 space-y-8 text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">Who we are</h2>
          <p>
            Globlearn Education (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is a study-in-China consultancy based in
            Dhaka, Bangladesh. This policy explains what personal data we collect through
            globlearnedu.com and through the messaging channels we operate.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">What we collect</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Contact details you give us: name, phone number, email, WhatsApp number.</li>
            <li>
              Academic details you share for counselling: degree level, subject interest, results or
              GPA and its scale, preferred intake, nationality, budget range.
            </li>
            <li>
              Messages you send us through the website chat widget, Facebook Messenger, Instagram or
              WhatsApp, including any attachments and voice notes.
            </li>
            <li>Technical data such as browser type and general location, for security and abuse prevention.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">How we use it</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>To answer your questions about universities, programs, fees and deadlines.</li>
            <li>To recommend suitable programs and to follow up on your enquiry.</li>
            <li>To assist with applications, if you ask us to.</li>
            <li>To keep records of our conversations so you do not have to repeat yourself.</li>
            <li>To detect abuse and keep the service secure.</li>
          </ul>
          <p className="mt-3">
            When you message us, an automated assistant may read your message and draft a reply to
            help our counsellors respond faster. A human counsellor takes over whenever you ask, or
            whenever your enquiry is sensitive.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">Automated assistance</h2>
          <p>
            We use an AI language model to help draft replies. Messages may be processed by that
            provider solely to generate a response. We do not use your messages to train public AI
            models, and we do not sell your data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">Who we share it with</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Universities or their authorised agents, only when you ask us to apply on your behalf.</li>
            <li>
              Service providers that host our website, database, file storage, email and messaging
              integration. They process data on our instructions only.
            </li>
            <li>Authorities, where the law requires it.</li>
          </ul>
          <p className="mt-3">We never sell your personal data.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">Messaging platforms</h2>
          <p>
            If you contact us through Facebook Messenger, Instagram or WhatsApp, those platforms also
            process your data under their own privacy policies. We receive your message, your
            platform identifier and whatever you choose to send us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">How long we keep it</h2>
          <p>
            We keep enquiry records for as long as we are helping you, and for up to 24 months after
            your last contact so we can continue a conversation from where it stopped. You can ask us
            to delete your data at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">Your rights</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Ask what personal data we hold about you.</li>
            <li>Ask us to correct it.</li>
            <li>Ask us to delete it.</li>
            <li>Ask us to stop contacting you.</li>
          </ul>
          <p className="mt-3">
            To exercise any of these, see our{" "}
            <Link href="/data-deletion" className="text-[#C8102E] font-medium hover:underline">
              data deletion page
            </Link>{" "}
            or email{" "}
            <a href="mailto:info@globlearnedu.com" className="text-[#C8102E] font-medium hover:underline">
              info@globlearnedu.com
            </a>
            . We respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">Security</h2>
          <p>
            Data is transmitted over HTTPS and stored in access-controlled databases. Access is
            limited to staff who need it. No system is perfectly secure, but we take these measures
            seriously.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">Children</h2>
          <p>
            Our service is intended for students aged 16 and above, and for parents or guardians
            enquiring on their behalf. We do not knowingly collect data from children under 16.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">Changes</h2>
          <p>We may update this policy. The date at the top shows the latest version.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">Contact</h2>
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
