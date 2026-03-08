import { useState } from "react";

export default function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border-b border-gray-50 last:border-0 transition-all ${open ? 'bg-blue-50/30 -mx-4 px-4 rounded-2xl md:-mx-8 md:px-8' : ''}`}>
      <div
        className="flex items-center justify-between py-6 cursor-pointer group"
        onClick={() => setOpen(!open)}
      >
        <span className={`text-lg font-bold transition-all ${open ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-500'}`}>
          {question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${open ? 'bg-blue-600 text-white rotate-180' : 'bg-gray-100 text-gray-400'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-500 font-medium leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}
