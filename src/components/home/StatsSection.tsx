const STATS = [
  {
    value: "280+",
    label: "Universities",
    sub: "partner institutions in China",
  },
  {
    value: "5,000+",
    label: "Students Placed",
    sub: "successfully enrolled across programs",
  },
  {
    value: "99%",
    label: "Visa Guidance",
    sub: "success rate based on student outcomes",
  },
  {
    value: "80+",
    label: "Countries",
    sub: "Africa, Middle East, South Asia & beyond",
  },
];

export function StatsSection() {
  return (
    <section style={{ backgroundColor: "#1B3A6B", padding: "64px 0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.35)",
              marginBottom: "8px",
            }}
          >
            Globlearn Education — By the Numbers
          </p>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: "900",
              color: "white",
            }}
          >
            Proven Track Record
          </h2>
        </div>

        <div
          className="grid grid-cols-2 lg:grid-cols-4"
          style={{
            gap: "1px",
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={i}
              style={{
                padding: "32px 20px",
                textAlign: "center",
                backgroundColor: "#1B3A6B",
              }}
            >
              <div
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  fontWeight: "900",
                  color: "#FFD700",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "white",
                  marginBottom: "4px",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.38)",
                }}
              >
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            color: "rgba(255,255,255,0.22)",
            fontSize: "11px",
            marginTop: "20px",
          }}
        >
          * Visa decisions are made by the Chinese Embassy. Success rate reflects our guidance outcomes.
        </p>
      </div>
    </section>
  );
}
