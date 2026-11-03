import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DetailPageShell from "../../../components/DetailPageShell";
import { accountService } from "../../users/services/accountService";
import { BlogDetailModal } from "../components/BlogDetailModal";
import { blogService } from "../services/blogService";

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const blogId = Number(id);
    if (!Number.isInteger(blogId) || blogId <= 0) {
      setError("Mã bài viết không hợp lệ.");
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError("");
    Promise.all([blogService.getById(blogId), accountService.getAllActive()])
      .then(([blogData, accountData]) => {
        if (!active) return;
        setBlog(blogData);
        setAccounts(accountData);
      })
      .catch((fetchError) => {
        if (active) setError(fetchError.message || "Không thể tải chi tiết bài viết.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [id]);

  const getAccountName = (accountId) =>
    accounts.find((account) => String(account.id) === String(accountId))?.fullName;

  return (
    <DetailPageShell backTo="/admin/blogs" backLabel="Quay lại danh sách bài viết" loading={loading} error={error}>
      <BlogDetailModal isOpen pageMode blog={blog} getAccountName={getAccountName} />
    </DetailPageShell>
  );
}
