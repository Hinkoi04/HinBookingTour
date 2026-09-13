import React, { useState, useEffect } from 'react';

const LoginForm = ({ onSubmit, loading, prefillEmail = "", prefillPassword = "" }) => {
  const [email, setEmail]       = useState(prefillEmail);
  const [password, setPassword] = useState(prefillPassword);

  useEffect(() => {
    setEmail(prefillEmail);
    setPassword(prefillPassword);
  }, [prefillEmail, prefillPassword]);

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Đăng Nhập</h2>
      <form
        onSubmit={(e) => { e.preventDefault(); onSubmit(email, password); }}
        className="space-y-5"
      >
        <input
          type="email"
          placeholder="Email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 mt-2 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 flex justify-center items-center"
        >
          {loading ? (
            <>
              <svg className="w-5 h-5 mr-2 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Đang xử lý...
            </>
          ) : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;