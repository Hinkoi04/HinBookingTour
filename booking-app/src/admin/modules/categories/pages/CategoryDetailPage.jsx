import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DetailPageShell from "../../../components/DetailPageShell";
import { accountService } from "../../users/services/accountService";
import { CategoryDetailModal } from "../components/CategoryDetailModal";
import { categoryService } from "../services/categoryApi";

export default function CategoryDetailPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const categoryId = Number(id);
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      setError("Mã danh mục không hợp lệ.");
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError("");
    Promise.all([
      categoryService.getById(categoryId),
      categoryService.getAllActive(),
      accountService.getAllActive(),
    ])
      .then(([categoryData, categoryList, accountList]) => {
        if (!active) return;
        setCategory(categoryData);
        setCategories(categoryList);
        setAccounts(accountList);
      })
      .catch((fetchError) => {
        if (active) setError(fetchError.message || "Không thể tải chi tiết danh mục.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [id]);

  return (
    <DetailPageShell backTo="/admin/categories" backLabel="Quay lại danh sách danh mục" loading={loading} error={error}>
      <CategoryDetailModal isOpen pageMode category={category} categories={categories} accounts={accounts} />
    </DetailPageShell>
  );
}
