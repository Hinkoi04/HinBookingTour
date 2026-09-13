import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "danger", 
  hideCancel = false,
}) {
  if (!isOpen) return null;

  const variantMap = {
    danger: {
      icon: "bg-red-50",
      iconColor: "text-red-500",
      confirm: "text-red-600 hover:bg-red-50",
    },
    warning: {
      icon: "bg-yellow-50",
      iconColor: "text-yellow-500",
      confirm: "text-yellow-600 hover:bg-yellow-50",
    },
    info: {
      icon: "bg-blue-50",
      iconColor: "text-blue-500",
      confirm: "text-blue-600 hover:bg-blue-50",
    },
  };

  const style = variantMap[variant] || variantMap.danger;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className={`w-12 h-12 rounded-full ${style.icon} flex items-center justify-center mx-auto mb-4`}>
            <AlertTriangle className={`w-6 h-6 ${style.iconColor}`} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 text-center">{title}</h3>
          <p className="text-sm text-gray-500 text-center mt-1">{message}</p>
        </div>
        <div className="flex border-t border-gray-100">

          {!hideCancel && (
            <>
              <button
                onClick={onCancel}
                className="flex-1 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {cancelText}
              </button>
              <div className="w-px bg-gray-100" />
            </>
          )}
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${style.confirm}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}