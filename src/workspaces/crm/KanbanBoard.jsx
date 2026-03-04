import { motion } from "framer-motion";
import { formatNumber } from "../../utils/formatters";

const STAGES = ["DISCOVERY", "PROPOSAL", "NEGOTIATION", "WON", "LOST"];

export default function KanbanBoard({ deals, onUpdateDeal, onEditDeal }) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-8 min-h-[600px] text-left">
      {STAGES.map((stage) => {
        const stageDeals = deals.filter((d) => d.stage === stage);
        return (
          <div key={stage} className="flex-shrink-0 w-80 flex flex-col gap-4">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50/50 rounded-2xl border border-gray-100">
              <h3 className="text-[10px] font-black font-subheading uppercase tracking-[0.2em] text-gray-500">
                {stage}
              </h3>
              <span className="text-[10px] font-black font-subheading text-gray-400 bg-white px-2 py-0.5 rounded-lg border border-gray-100">
                {stageDeals.length}
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              {stageDeals.map((deal) => (
                <motion.div
                  layoutId={deal.id}
                  key={deal.id}
                  onClick={() => onEditDeal(deal)}
                  className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-black font-heading text-[#111827] tracking-tight group-hover:text-[#195bac] transition-colors">
                      {deal.title}
                    </h4>
                    <span className="text-[10px] font-bold font-body text-gray-400">
                      #DEAL-{deal.id.toString().padStart(4, "0")}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[11px] font-bold font-subheading text-gray-500">
                      <span>Opportunity</span>
                      <span className="text-[#111827] font-black font-heading">
                        ${formatNumber(Number(deal.value))}
                      </span>
                    </div>

                    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${deal.probability}%` }}
                        className={`h-full ${
                          stage === "WON"
                            ? "bg-emerald-500"
                            : stage === "LOST"
                              ? "bg-rose-500"
                              : "bg-blue-500"
                        }`}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[9px] font-black font-body uppercase tracking-widest text-gray-400">
                      <span>{deal.probability}% Prob.</span>
                      <span>
                        {deal.expected_close_date
                          ? new Date(
                              deal.expected_close_date,
                            ).toLocaleDateString()
                          : "No Date"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {stageDeals.length === 0 && (
                <div className="h-32 rounded-[32px] border-2 border-dashed border-gray-50 flex items-center justify-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  Empty Stage
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
