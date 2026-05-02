
export const metadata = {
  title: "Contact Globlearn Edu",
  description: "Contact us for study abroad help"
};

export default function Contact() {
  return (
    <div>
      <h1>Contact Us</h1>
      <form>
        <input placeholder="Name" /><br/>
        <input placeholder="Email" /><br/>
        <textarea placeholder="Message" /><br/>
        <button>Send</button>
      </form>
    </div>
  );
}
