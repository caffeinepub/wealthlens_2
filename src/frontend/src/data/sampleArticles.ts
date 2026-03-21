import { Category } from "../backend";

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.stock]: "Saham",
  [Category.crypto]: "Crypto",
  [Category.property]: "Properti",
  [Category.finance]: "Keuangan",
  [Category.economicHistory]: "Sejarah",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.stock]: "bg-emerald-100 text-emerald-800",
  [Category.crypto]: "bg-orange-100 text-orange-800",
  [Category.property]: "bg-blue-100 text-blue-800",
  [Category.finance]: "bg-purple-100 text-purple-800",
  [Category.economicHistory]: "bg-amber-100 text-amber-800",
};

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
