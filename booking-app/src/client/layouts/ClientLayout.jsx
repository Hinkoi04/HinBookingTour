import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ScrollToTop } from "../components/ScrollToTop";

export function ClientLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans antialiased selection:bg-blue-500 selection:text-white">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default ClientLayout;
