import QueueTable from "../components/QueueTable";
import DetailPanel from "../components/DetailPanel";

const SALES_DATA = [
  {
    values: [
      <span className="font-medium text-gray-900">LEAD-101</span>,
      <span className="text-gray-700">Acme Corp Enterprise Deal</span>,
      <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-medium">Negotiation</span>,
      <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-xs font-medium">$50k</span>,
      <span className="text-gray-500">1h ago</span>
    ],
    detail: {
      id: "LEAD-101",
      title: "Acme Corp Enterprise Deal",
      meta: "Pipeline: Enterprise",
      details: [
        { label: "Stage", value: "Negotiation", color: "text-green-600" },
        { label: "Value", value: "$50,000", color: "text-purple-600" },
        { label: "Owner", value: "Sarah J." }
      ],
      action: "Send Contract"
    }
  },
  {
    values: [
      <span className="font-medium text-gray-900">LEAD-104</span>,
      <span className="text-gray-700">Startup Plan Inquiry</span>,
      <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs font-medium">New</span>,
      <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">$2k</span>,
      <span className="text-gray-500">3h ago</span>
    ],
    detail: {
      id: "LEAD-104",
      title: "Startup Plan Inquiry",
      meta: "Inbound Lead",
      details: [
        { label: "Stage", value: "New Lead", color: "text-blue-600" },
        { label: "Source", value: "Website" },
        { label: "Region", value: "North America" }
      ],
      action: "Schedule Demo"
    }
  }
];

export default function SalesWorkspace({ onBack, initialView }) {
  const selectedItem = SALES_DATA[0];

  return (
    <div className="flex h-full w-full">
        <QueueTable 
          title="Active Leads"
          columns={["ID", "Deal Name", "Stage", "Value", "Activity"]}
          data={SALES_DATA}
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
