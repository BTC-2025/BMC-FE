import ContactCard from "../components/support/ContactCard";
import FAQItem from "../components/support/FAQItem";

export default function Support() {
  return (
    <div className="max-w-6xl mx-auto space-y-12 p-4 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Help & Support</h1>
          <p className="text-gray-500 mt-2 text-lg">Everything you need to master your ESS workspace.</p>
        </div>
      </div>

      <ContactCard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* FAQ Section */}
        <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900">Frequently Asked Questions</h3>
          </div>

          <div className="divide-y divide-gray-50">
            <FAQItem
              question="How can I apply for a leave of absence?"
              answer="Navigate to the 'Leave' page from the sidebar, click the 'Apply Leave' button, fill in your dates and reason, and click submit. You can track the approval status in your history table."
            />

            <FAQItem
              question="Where do I find my monthly payslips?"
              answer="Your payslips are available in the 'Payroll' section. Use the month selector to view specific periods and click 'Download PDF' to save an official copy."
            />

            <FAQItem
              question="How do I mark my daily attendance?"
              answer="Go to the 'Attendance' page, grant permission for GPS and Camera if prompted, choose your check-in mode, and click 'Mark Attendance'. Your timeline will update instantly."
            />

            <FAQItem
              question="Can I download my personal documents?"
              answer="Yes, all your uploaded and company-issued documents are available in the 'Documents' module. Simply click on the file icon to view or download."
            />
          </div>
        </div>

        {/* Resources Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6">Learning Center</h3>
            <ul className="space-y-4">
              {[
                { label: "Employee Handbook", type: "PDF", size: "2.4 MB" },
                { label: "Platform Video Intro", type: "VIDEO", size: "15:40" },
                { label: "Benefits & Policies", type: "PDF", size: "1.1 MB" },
                { label: "IT Security Guide", type: "DOC", size: "850 KB" }
              ].map((res, i) => (
                <li key={i} className="group cursor-pointer">
                  <div className="flex items-center gap-4 p-2 rounded-xl group-hover:bg-blue-50 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{res.label}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{res.type} • {res.size}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-orange-50 p-8 rounded-[2rem] border border-orange-100 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-lg font-black text-orange-900">System Status</h4>
              <p className="text-sm text-orange-700 font-medium mt-1">Check scheduled maintenance and uptime report.</p>
              <button className="mt-6 px-6 py-3 bg-white text-orange-600 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95">View Uptime</button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-200/30 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
