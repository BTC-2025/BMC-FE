export default function ContactCard() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-10 rounded-[2.5rem] shadow-xl shadow-blue-100 flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex-1">
        <h3 className="text-3xl font-black mb-3 tracking-tight">Still Need Help?</h3>
        <p className="text-blue-100 text-lg font-medium">
          Our dedicated support team is available 24/7 to assist you with any questions or technical issues.
        </p>
      </div>

      <div className="flex gap-4 shrink-0">
        <a
          href="mailto:support@company.com"
          className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:text-blue-600 px-8 py-4 rounded-2xl font-black transition-all active:scale-95 flex items-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Email Support
        </a>

        <a
          href="tel:+15551234567"
          className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          Call Us
        </a>
      </div>
    </div>
  );
}
