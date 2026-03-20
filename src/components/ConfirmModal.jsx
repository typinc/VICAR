import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Accessible confirmation dialog — replaces native browser confirm().
 *
 * Props:
 *   isOpen       — whether the dialog is visible
 *   title        — bold heading (optional)
 *   message      — body text
 *   confirmLabel — text for the destructive button (default: "Confirm")
 *   onConfirm    — called when the user clicks the confirm button
 *   onCancel     — called on Cancel, backdrop click, or Escape key
 */
export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Body */}
        <div className="flex items-start gap-3 p-5">
          <AlertTriangle size={20} className="text-yellow-400 shrink-0 mt-0.5" />
          <div>
            {title && (
              <p className="text-white font-bold text-sm mb-1">{title}</p>
            )}
            <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold border border-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-semibold transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
