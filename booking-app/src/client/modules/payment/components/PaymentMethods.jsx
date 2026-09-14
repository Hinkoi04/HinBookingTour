export function PaymentMethods({ methods = [], selectedMethod, onSelect }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-black text-gray-900 mb-6">Phương thức thanh toán</h2>
      <div className="space-y-3">
        {methods.map((pm) => (
          <label
            key={pm.id}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedMethod === pm.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value={pm.id}
              checked={selectedMethod === pm.id}
              onChange={() => onSelect(pm.id)}
              className="hidden"
            />
            <span className="text-2xl">{pm.icon}</span>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">{pm.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{pm.desc}</p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selectedMethod === pm.id
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-300"
              }`}
            >
              {selectedMethod === pm.id && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

export default PaymentMethods;
