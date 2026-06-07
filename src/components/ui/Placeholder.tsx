export function Placeholder({ title }: { title: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-3 text-slate-500">This page is scaffolded and ready for implementation.</p>
    </div>
  );
}
