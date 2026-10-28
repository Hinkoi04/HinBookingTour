import { AlertTriangle, CheckCircle2 } from "lucide-react";

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
      icon: "bg-red-100",
      iconColor: "text-red-600",
      confirm: "bg-red-600 text-white hover:bg-red-700",
    },
    warning: {
      icon: "bg-amber-100",
      iconColor: "text-amber-600",
      confirm: "bg-amber-500 text-white hover:bg-amber-600",
    },
    info: {
      icon: "bg-amber-100",
      iconColor: "text-amber-600",
      confirm: "bg-amber-500 text-white hover:bg-amber-600",
    },
    success: {
      icon: "bg-green-100",
      iconColor: "text-green-600",
      confirm: "bg-green-600 text-white hover:bg-green-700",
    },
  };

  const style = variantMap[variant] || variantMap.danger;
  const Icon = variant === "success" ? CheckCircle2 : AlertTriangle;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className={`w-12 h-12 rounded-full ${style.icon} flex items-center justify-center mx-auto mb-4`}>
            <Icon className={`w-6 h-6 ${style.iconColor}`} />
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