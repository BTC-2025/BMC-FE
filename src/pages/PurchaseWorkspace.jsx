import QueueTable from "../components/QueueTable";
import DetailPanel from "../components/DetailPanel";

const PURCHASE_DATA = [
  {
    values: [
      <span className="font-medium text-gray-900">PO-4402</span>,
      <span className="text-gray-700">Office Furniture Bulk</span>,
      <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs font-medium">Pending Quote</span>,
      <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">Medium</span>,
      <span className="text-gray-500">5h ago</span>
    ],
    detail: {
      id: "PO-4402",
      title: "New Office Desks",
      meta: "Procurement",
      details: [
        { label: "Vendor", value: "Herman Miller" },
        { label: "Estimated Cost", value: "$45,000" },
        { label: "Status", value: "Waiting for Quote", color: "text-blue-600" }
      ],
      action: "Review Quotes"
    }
  },
  {
    values: [
      <span className="font-medium text-gray-900">PO-4405</span>,
      <span className="text-gray-700">Software Licenses (Adobe)</span>,
      <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-medium">Approved</span>,
      <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs font-medium">High</span>,
      <span className="text-gray-500">1d ago</span>
    ],
    detail: {
      id: "PO-4405",
      title: "Adobe CC Enterprise",
      meta: "IT Procurement",
      details: [
        { label: "Vendor", value: "Adobe Systems" },
        { label: "Cost", value: "$12,000/yr" },
        { label: "Renewal", value: "Auto-renew" }
      ],
      action: "Issue PO"
    }
  }
];

export default function PurchaseWorkspace({ onBack, initialView }) {
  const selectedItem = PURCHASE_DATA[0];

  return (
    <div className="flex h-full w-full">
        <QueueTable 
          title="Purchase Orders"
          columns={["ID", "Order", "Status", "Priority", "Updated"]}
          data={PURCHASE_DATA}
          onBack={onBack}
        />
        <DetailPanel 
          id={selectedItem.detail.id}
          title={selectedItem.detail.title}
          meta={selectedItem.detail.meta}
          details={selectedItem.detail.details}
          actionText={selectedItem.detail.action}
        />
      </div>
  );
}
