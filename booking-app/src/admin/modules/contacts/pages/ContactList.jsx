import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { RefreshCw, Mail, Loader2 } from "lucide-react";
import { contactService } from "../services/contactService";
import Pagination from "../../../components/Pagination";

export default function ContactList() {
    const { searchQuery } = useOutletContext();
    const [contacts, setContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await contactService.getAll();
            setContacts(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const filteredContacts = [...contacts]
        .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return (Number.isFinite(dateB) ? dateB : 0) - (Number.isFinite(dateA) ? dateA : 0);
        })
        .filter(contact => {
            return (contact.email || "").toLowerCase().includes(searchQuery.toLowerCase());
        });

    const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedContacts = filteredContacts.slice(startIndex, startIndex + itemsPerPage);

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

  return (
    <div className="w-full p-6 lg:p-8 space-y-6 max-w-full overflow-hidden">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full overflow-hidden">
        <div className="p-6 pb-2 border-b border-gray-100 flex justify-end items-center">
          <button 
            onClick={fetchData}
            className="p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="p-6 min-h-[300px] flex flex-col justify-start">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-gray-500 text-sm font-medium">Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <p className="text-red-500 font-medium mb-1">Không thể tải dữ liệu</p>
              <p className="text-gray-400 text-xs">{error}</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">Không tìm thấy email nào.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 font-medium rounded-tl-lg w-20 text-center">STT</th>
                      <th className="px-4 py-3 font-medium">Email liên hệ</th>
                      <th className="px-4 py-3 font-medium rounded-tr-lg">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedContacts.map((contact, index) => (
                      <tr key={contact.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-4 text-center font-medium text-gray-500">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-gray-900 font-medium">
                            <Mail className="w-4 h-4 text-blue-500" /> 
                            <span>{contact.email || "—"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-500 font-medium">
                          {formatDate(contact.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {totalPages > 0 && (
                <div className="mt-6">
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}