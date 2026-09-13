import { Navigate, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logoTravelGo from "../../assets/Client/images/logotravelgo.png";


function AuthLayout() {
  const token = localStorage.getItem("accessToken");
  if (token) return <Navigate to="/admin" replace />;

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Header */}
      <header className="w-full bg-white border-b border-gray-100 shadow-sm px-8 py-4 flex items-center gap-3 ">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 hover:opacity-70 transition-opacity"
        >
          <span className="text-base font-bold text-blue-600">Về trang chủ</span>
        </button>
        <div className="flex items-center justify-center w-full  max-w-6xl">
          <img className="logo__img " src={logoTravelGo} alt="TRAVELGO" />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="flex w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden min-h-[460px]">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-100 bg-white px-8 py-4 text-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Tour Booking System. All rights reserved.
        </p>
      </footer>

    </div>
  );
}

export default AuthLayout;