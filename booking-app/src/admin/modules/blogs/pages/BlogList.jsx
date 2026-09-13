import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Lock } from "lucide-react";
import { BlogTable } from "../components/BlogTable";
import { BlogTrashTable } from "../components/BlogTrashTable";
import { BlogDetailModal } from "../components/BlogDetailModal";
import ConfirmModal from "../../../components/ConfirmModal";
import Pagination from "../../../components/Pagination";
import { blogService } from "../services/blogService";
import { accountService } from "../../users/services/accountService";

export function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [trashedBlogs, setTrashedBlogs] = useState([]);
  const [accountList, setAccountList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [trashSearch, setTrashSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [confirmState, setConfirmState] = useState({ open: false, type: null, id: null });

  const userPermissions = useMemo(() => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) return [];
      const user = JSON.parse(userString);
      return user.permissions || []; 
    } catch (e) {
      return [];
    }
  }, []);

  const canCreate = userPermissions.includes("CREATE_BLOG");
  const canUpdate = userPermissions.includes("UPDATE_BLOG");
  const canDelete = userPermissions.includes("DELETE_BLOG");
  const canViewTrash = canDelete;

  const loadData = async () => {
    try {
      setLoading(true);
      const [active, trash, accounts] = await Promise.all([
        blogService.getAll(),
        canViewTrash ? blogService.getAllTrash().catch(() => []) : Promise.resolve([]),
        accountService.getAllActive().catch(() => []),
      ]);
      setBlogs(active);
      setTrashedBlogs(trash);
      setAccountList(accounts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadData(); 
  }, [canViewTrash, activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, trashSearch, activeTab]);

  const getAccountName = (id) => {
    const acc = accountList.find(a => String(a.id) === String(id));
    return acc ? acc.fullName : null;
  };

  const filteredBlogs = blogs.filter(b =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTrash = trashedBlogs.filter(b =>
    b.title.toLowerCase().includes(trashSearch.toLowerCase())
  );

  const currentList = activeTab === "active" ? filteredBlogs : filteredTrash;
  const totalPages = Math.ceil(currentList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedList = currentList.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id) => {
    if (canDelete) setConfirmState({ open: true, type: "delete", id });
  };
  const handleRestore = (id) => {
    if (canUpdate) setConfirmState({ open: true, type: "restore", id });
  };
  const handleHardDelete = (id) => {
    if (canDelete) setConfirmState({ open: true, type: "hardDelete", id });
  };

  const handleConfirm = async () => {
    const { type, id } = confirmState;
    try {
      if (type === "delete" && canDelete) await blogService.softDelete(id);
      if (type === "restore" && canUpdate) await blogService.restore(id);
      if (type === "hardDelete" && canDelete) await blogService.hardDelete(id);
      await loadData();
    } catch (err) {
      alert("Lỗi: " + err.message);
    } finally {
      setConfirmState({ open: false, type: null, id: null });
    }
  };

  const confirmConfig = {
    delete:     { title: "Xóa bài viết",       message: "Bài viết sẽ được chuyển vào thùng rác.",          confirmText: "Xóa",          variant: "danger"  },
    restore:    { title: "Khôi phục bài viết",  message: "Bài viết sẽ được khôi phục về danh sách chính.", confirmText: "Khôi phục",    variant: "info"    },
    hardDelete: { title: "Xóa vĩnh viễn",       message: "Hành động này không thể hoàn tác!",              confirmText: "Xóa vĩnh viễn", variant: "danger" },
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Bài viết</h1>
          <p className="text-gray-500 mt-1">Tạo và quản lý các bài viết tin tức</p>
        </div>
        {canCreate && (
          <Link
            to="/admin/blogs/new"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-colors font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" /> Thêm bài viết
          </Link>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden p-6">
        <div className="inline-flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab("active")}
            className={`py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${activeTab === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Bài viết ({blogs.length})
          </button>
          
          <button
            onClick={() => canViewTrash && setActiveTab("trash")}
            disabled={!canViewTrash}
            title={!canViewTrash ? "Cần quyền xóa (DELETE_BLOG) để xem Thùng rác" : ""}
            className={`flex items-center gap-1.5 py-2 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
              !canViewTrash ? "opacity-50 cursor-not-allowed text-gray-400" : 
              activeTab === "trash" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {!canViewTrash && <Lock className="w-3.5 h-3.5" />}
            Thùng rác {canViewTrash && `(${trashedBlogs.length})`}
          </button>
        </div>

        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={activeTab === "active" ? "Tìm kiếm bài viết..." : "Tìm kiếm trong thùng rác..."}
            value={activeTab === "active" ? searchTerm : trashSearch}
            onChange={(e) => activeTab === "active" ? setSearchTerm(e.target.value) : setTrashSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-gray-300 text-sm"
          />
        </div>

        {activeTab === "active" ? (
          <BlogTable
            blogs={paginatedList}
            onView={(blog) => { setSelectedBlog(blog); setIsDetailOpen(true); }}
            onDelete={handleDelete}
            getAccountName={getAccountName}
            canUpdate={canUpdate}
            canDelete={canDelete}
          />
        ) : (
          <BlogTrashTable
            blogs={paginatedList}
            onRestore={handleRestore}
            onHardDelete={handleHardDelete}
            getAccountName={getAccountName}
            canUpdate={canUpdate}
            canDelete={canDelete}
          />
        )}

        {totalPages > 0 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <BlogDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        blog={selectedBlog}
        getAccountName={getAccountName}
      />

      <ConfirmModal
        isOpen={confirmState.open}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmState({ open: false, type: null, id: null })}
        {...(confirmConfig[confirmState.type] || {})}
      />
    </div>
  );
}