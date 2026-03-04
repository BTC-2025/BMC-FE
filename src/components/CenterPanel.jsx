export default function CenterPanel() {
  return (
    <section className="flex-1 p-8 overflow-auto">
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-lg font-semibold">
          Service Tickets
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Select a queue to view related service requests.
        </p>

        <div className="mt-6 border rounded-lg divide-y">
          <div className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer">
            INC-4021 · Low stock alert
          </div>
          <div className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer">
            INC-4022 · Damaged item reported
          </div>
        </div>
      </div>
    </section>
  );
}
