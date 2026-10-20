import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Data Deletion Request | Globlearn Education",
  description:
    "How to request deletion of personal data that Globlearn Education holds about you, including messages sent through Facebook Messenger, Instagram or WhatsApp.",
};

export default function DataDeletionPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-[#1B3A6B]">Data Deletion Request</h1>
      <p className="text-sm text-slate-500 mt-2">Last updated: 20 October 2026</p>

      <div className="mt-8 space-y-8 text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">You can ask us to delete your data</h2>
          <p>
            If you have contacted Globlearn Education through our website chat, Facebook Messenger,
            Instagram or WhatsApp, you can ask us to delete the personal data we hold about you.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">How to request deletion</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Email{" "}
              <a
                href="mailto:info@globlearnedu.com?subject=Data%20deletion%20request"
                className="text-[#C8102E] font-medium hover:underline"
              >
                info@globlearnedu.com
              </a>{" "}
              with the subject <strong>&ldquo;Data deletion request&rdquo;</strong>.
            </li>
            <li>
              Tell us which channel you used to contact us (website chat, Messenger, Instagram or
              WhatsApp), and the name or phone number you used.
            </li>
            <li>
              Or message us on WhatsApp at{" "}
              <a
                href="https://wa.me/8615655031556?text=Data%20deletion%20request"
                className="text-[#C8102E] font-medium hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                +86 156 5503 1556
              </a>{" "}
              and say that you want your data deleted.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">What we delete</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Your name, phone number, email and any other contact details.</li>
            <li>Your academic details and enquiry history held in our records.</li>
            <li>The messages exchanged with us, and any attachments or voice notes you sent.</li>
            <li>Any internal notes or summaries derived from those conversations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">What we may need to keep</h2>
          <p>
            If we have already submitted an application on your behalf, or if the law requires us to
            keep a financial or contractual record, we may need to retain the minimum necessary
            information. We will tell you exactly what and why in our reply.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">How long it takes</h2>
          <p>
            We acknowledge your request within 3 working days and complete deletion within 30 days. We
            will confirm by email when it is done.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">Deleting data on Facebook</h2>
          <p>
            You can also remove apps connected to your Facebook account at any time: go to{" "}
            <span className="font-medium">Facebook → Settings → Apps and Websites</span> and remove
            the app. That stops any further data being shared with us, but does not by itself delete
            what we already hold, so please still email us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">Stopping messages</h2>
          <p>
            Replying <strong>STOP</strong> in any of our chats will also stop automated messages from
            us. You can ask us to delete your data separately at any time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#1B3A6B] mb-2">More information</h2>
          <p>
            See our{" "}
            <Link href="/privacy" className="text-[#C8102E] font-medium hover:underline">
              Privacy Policy
            </Link>{" "}
            for the full picture of what we collect and why.
          </p>
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
