import { Users, User, Calendar, CreditCard, Check } from "lucide-react";

export function BookingForm({
  form,
  setForm,
  passengers = [],
  setPassengers,
  errors = {},
  setErrors,
  adults = 1,
  children = 0,
  babies = 0,
}) {
  const field = (key, label, placeholder, type = "text", required = false) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key] || ""}
        onChange={(e) => {
          const val = e.target.value;
          setForm((p) => {
            const next = { ...p, [key]: val };
            // If first passenger is set to copy contact person, auto-sync
            if (passengers.length > 0 && passengers[0].sameAsContact) {
              setPassengers((prevList) => {
                const nextList = [...prevList];
                if (key === "fullName") nextList[0] = { ...nextList[0], fullName: val };
                if (key === "idNumber") nextList[0] = { ...nextList[0], idCard: val };
                if (key === "phone") nextList[0] = { ...nextList[0], phone: val };
                return nextList;
              });
            }
            return next;
          });
          setErrors((p) => ({ ...p, [key]: "" }));
        }}
        className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
          errors[key] ? "border-red-400 bg-red-50" : "border-gray-200"
        }`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  );

  const handlePassengerChange = (index, fieldKey, val) => {
    setPassengers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [fieldKey]: val };
      return next;
    });
    setErrors((prev) => ({
      ...prev,
      [`passenger_${index}_${fieldKey}`]: "",
    }));
  };

  const handleToggleSameAsContact = (index, checked) => {
    setPassengers((prev) => {
      const next = [...prev];
      if (checked) {
        next[index] = {
          ...next[index],
          sameAsContact: true,
          fullName: form.fullName || next[index].fullName,
          idCard: form.idNumber || next[index].idCard,
          phone: form.phone || next[index].phone,
        };
      } else {
        next[index] = {
          ...next[index],
          sameAsContact: false,
        };
      }
      return next;
    });
  };

  const totalPassengers = passengers.length;

  return (
    <div className="space-y-6">
      {/* 1. Thông tin người đặt tour / liên hệ */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" /> Thông tin người liên hệ / đặt tour
          </h2>
          <span className="text-xs text-gray-400">Người nhận vé và thông báo</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field("fullName", "Họ và tên", "Nguyễn Văn A", "text", true)}
          {field("phone", "Số điện thoại", "0901 234 567", "tel", true)}
          {field("email", "Email nhận vé", "email@example.com", "email", true)}
          {field("idNumber", "Số CMND / CCCD / Hộ chiếu", "012345678901", "text", true)}
        </div>
        <div className="mt-4">
          {field("address", "Địa chỉ liên hệ", "Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành")}
        </div>
        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Ghi chú yêu cầu đặc biệt
          </label>
          <textarea
            rows={2}
            placeholder="Yêu cầu ăn kiêng, xe đưa đón, phòng nghỉ..."
            value={form.notes || ""}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>

      {/* 2. Danh sách hành khách đi cùng */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" /> Danh sách hành khách ({totalPassengers} người)
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Vui lòng điền thông tin chi tiết cho từng hành khách tham gia chuyến đi
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
              {adults} Người lớn
            </span>
            {children > 0 && (
              <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                {children} Trẻ em
              </span>
            )}
            {babies > 0 && (
              <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">
                {babies} Em bé
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {passengers.map((p, idx) => {
            const errName = errors[`passenger_${idx}_fullName`];
            const errDob = errors[`passenger_${idx}_dob`];

            const badgeBg =
              p.type === "adult"
                ? "bg-blue-100 text-blue-700 border-blue-200"
                : p.type === "children"
                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                : "bg-purple-100 text-purple-700 border-purple-200";

            return (
              <div
                key={p.id || idx}
                className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 hover:bg-white hover:shadow-xs transition-all"
              >
                <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2 pb-2.5 border-b border-gray-200/60">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gray-800 text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-gray-800 text-sm">
                      Hành khách #{idx + 1}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${badgeBg}`}>
                      {p.typeLabel}
                    </span>
                  </div>

                  {idx === 0 && (
                    <label className="flex items-center gap-2 text-xs text-blue-600 font-semibold cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={p.sameAsContact || false}
                        onChange={(e) => handleToggleSameAsContact(idx, e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span>Là người đặt tour</span>
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {/* Họ tên */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: NGUYEN VAN A"
                      value={p.fullName || ""}
                      onChange={(e) => handlePassengerChange(idx, "fullName", e.target.value.toUpperCase())}
                      className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                        errName ? "border-red-400 bg-red-50" : "border-gray-200"
                      }`}
                    />
                    {errName && <p className="text-[11px] text-red-500 mt-0.5">{errName}</p>}
                  </div>

                  {/* Giới tính */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Giới tính <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={p.gender || "Nam"}
                      onChange={(e) => handlePassengerChange(idx, "gender", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  {/* Ngày sinh */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Ngày sinh {p.type !== "adult" && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="date"
                      value={p.dob || ""}
                      onChange={(e) => handlePassengerChange(idx, "dob", e.target.value)}
                      className={`w-full border rounded-xl px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                        errDob ? "border-red-400 bg-red-50" : "border-gray-200"
                      }`}
                    />
                    {errDob && <p className="text-[11px] text-red-500 mt-0.5">{errDob}</p>}
                  </div>

                  {/* CMND/CCCD (chỉ với người lớn) */}
                  {p.type === "adult" && (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        CMND / CCCD / Hộ chiếu
                      </label>
                      <input
                        type="text"
                        placeholder="Số căn cước hoặc hộ chiếu"
                        value={p.idCard || ""}
                        onChange={(e) => handlePassengerChange(idx, "idCard", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  )}

                  {/* Số điện thoại (tùy chọn) */}
                  {p.type === "adult" && (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Số điện thoại cá nhân (tùy chọn)
                      </label>
                      <input
                        type="tel"
                        placeholder="09xx xxx xxx"
                        value={p.phone || ""}
                        onChange={(e) => handlePassengerChange(idx, "phone", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
