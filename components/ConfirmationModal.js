"use client";

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmText = "Delete",
  cancelText = "Cancel",
  isDanger = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 text-center">
            <h3 className="text-xl font-bold font-space-grotesk text-neutral-900 mb-2">{title}</h3>
            <p className="text-neutral-800 text-sm leading-relaxed font-spaceMono font-semibold">{message}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 font-spaceMono px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-bold text-sm hover:bg-neutral-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 font-spaceMono px-4 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all transform active:scale-95 ${
              isDanger 
                ? "bg-red-500 hover:bg-red-600 shadow-red-500/20" 
                : "bg-black hover:bg-neutral-800 shadow-black/20"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
