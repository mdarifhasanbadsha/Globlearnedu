
export const metadata = {
  title: "Study Abroad | Globlearn Edu",
  description: "Find top universities and apply easily."
};

export default function Home() {
  return (
    <div>
      <h1>Study Abroad with Globlearn Edu 🌍</h1>
      <p>Explore universities and apply online.</p>

      <h2>Popular Universities</h2>
      <ul>
        <li><a href="/universities/university-of-toronto">University of Toronto</a></li>
        <li><a href="/universities/university-of-oxford">University of Oxford</a></li>
      </ul>
    </div>
  );
}
