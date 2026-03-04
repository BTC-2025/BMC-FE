import { createPortal } from 'react-dom';

export default function BaseModal({ isOpen, onClose, children, className = "" }) {
  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-950/40 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-[32px] w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
