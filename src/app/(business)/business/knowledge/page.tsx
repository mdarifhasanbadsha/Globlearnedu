import KnowledgeImport from "./_KnowledgeImport";
import KnowledgeClient from "./_KnowledgeClient";

export const dynamic = "force-dynamic";

export default function KnowledgePage() {
  return (
    <div className="space-y-4">
      <KnowledgeImport />
      <KnowledgeClient />
    </div>
  );
}
