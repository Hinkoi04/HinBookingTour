export function BookingForm({ form, setForm, errors, setErrors }) {
  const field = (key, label, placeholder, type = "text", required = false) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => {
          setForm((p) => ({ ...p, [key]: e.target.value }));
          setErrors((p) => ({ ...p, [key]: "" }));
        }}
        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          errors[key] ? "border-red-400 bg-red-50" : "border-gray-200"
        }`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-black text-gray-900 mb-6">Thông tin liên hệ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {field("fullName", "Họ và tên", "Nguyễn Văn A", "text", true)}
        {field("phone", "Số điện thoại", "0901 234 567", "tel", true)}
        {field("email", "Email", "email@example.com", "email", true)}
        {field("idNumber", "CMND / CCCD", "012345678901", "text", true)}
      </div>
      <div className="mt-5">
        {field("address", "Địa chỉ", "Số nhà, đường, phường, quận, tỉnh/TP")}
      </div>
      <div className="mt-5">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Ghi chú
        </label>
        <textarea
          rows={3}
          placeholder="Yêu cầu đặc biệt, thông tin thêm về đoàn..."
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
    </div>
  );
}

export default BookingForm;
