
export const metadata = {
  title: "Globlearn Edu",
  description: "Study abroad platform"
};

export default function Layout({ children }: any) {
  return (
    <html>
      <body>
        <nav style={{ padding: 20 }}>
          <a href="/">Home</a> |{" "}
          <a href="/universities">Universities</a> |{" "}
          <a href="/dashboard">Dashboard</a> |{" "}
          <a href="/contact">Contact</a>
        </nav>
        <main style={{ padding: 20 }}>{children}</main>
      </body>
    </html>
  );
}
