import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  title = "Xác nhận",
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return createPortal((
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-confirm-title"
        aria-describedby="client-confirm-message"
        className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="p-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 id="client-confirm-title" className="text-center text-lg font-bold text-gray-900">
            {title}
          </h2>
          <p id="client-confirm-message" className="mt-1 text-center text-sm text-gray-500">
            {message}
          </p>
        </div>
        <div className="flex border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            {cancelText}
          </button>
          <div className="w-px bg-gray-100" />
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-blue-600 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  ), document.body);
}
