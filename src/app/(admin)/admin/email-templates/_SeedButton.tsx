"use client";

export default function SeedButton() {
  async function handleSeed() {
    const res = await fetch("/api/admin/email-templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "seed" }),
    });
    if (res.ok) window.location.reload();
  }

  return (
    <button
      onClick={handleSeed}
      className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
      style={{ backgroundColor: "#C8102E" }}
    >
      Load 13 default templates
    </button>
  );
}
