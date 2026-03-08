import { useState } from "react";
import DocumentCategoryCard from "../components/cards/DocumentCategoryCard";
import DocumentTable from "../components/tables/DocumentTable";
import UploadDocumentModal from "../components/modals/UploadDocumentModal";

export default function Documents() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Documents</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="text-xl">+</span> Upload Document
        </button>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-4 gap-6">
        <DocumentCategoryCard title="Personal" count={12} />
        <DocumentCategoryCard title="Official" count={8} />
        <DocumentCategoryCard title="Payslips" count={24} />
        <DocumentCategoryCard title="Others" count={5} />
      </div>

      {/* Table */}
      <DocumentTable />

      <UploadDocumentModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
