export function BookingSteps({ currentStep = 1 }) {
  const steps = ["Chọn tour", "Điền thông tin", "Thanh toán", "Hoàn tất"];

  return (
    <div className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    i === currentStep
                      ? "text-blue-600 font-bold"
                      : i < currentStep
                      ? "text-gray-800"
                      : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
              {i < 3 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 ${
                    i < currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookingSteps;
