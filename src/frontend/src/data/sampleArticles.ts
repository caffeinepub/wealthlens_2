import { Category } from "../backend";

export interface SampleArticle {
  id: bigint;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  coverImageUrl: string;
  author: string;
  authorName: string;
  publishedAt: string;
  tags: string[];
  likes: number;
  bookmarks: number;
  comments: number;
}

export const SAMPLE_ARTICLES: SampleArticle[] = [
  {
    id: BigInt(1),
    title: "Strategi Investasi Saham di Tengah Volatilitas Pasar 2025",
    excerpt:
      "Pasar saham Indonesia mengalami guncangan besar di awal 2025. Bagaimana investor cerdas memanfaatkan momen volatilitas untuk meraup keuntungan maksimal?",
    content: `## Mengapa Volatilitas Bukan Musuh Investor

Banyak investor pemula yang langsung panik ketika melihat indeks saham anjlok puluhan persen dalam hitungan hari. Namun bagi investor berpengalaman, volatilitas justru adalah kesempatan emas.

Prinsip dasar investasi saham yang dikemukakan Warren Buffett masih relevan hingga hari ini: **"Be fearful when others are greedy, and greedy when others are fearful."**

## Strategi Dollar-Cost Averaging (DCA)

Salah satu strategi paling efektif untuk menghadapi volatilitas adalah Dollar-Cost Averaging (DCA). Dengan metode ini, Anda secara rutin menginvestasikan jumlah tetap setiap bulan, terlepas dari kondisi pasar.

Keuntungan DCA:
- Mengurangi risiko timing yang salah
- Membangun disiplin investasi
- Rata-rata harga beli lebih rendah dalam jangka panjang

## Diversifikasi Portofolio

Jangan taruh semua telur dalam satu keranjang. Diversifikasi ke berbagai sektor: perbankan, teknologi, komoditas, dan consumer goods dapat memitigasi risiko secara signifikan.

## Analisis Fundamental vs Teknikal

Untuk investasi jangka panjang, analisis fundamental lebih penting. Periksa:
- Price to Earnings Ratio (P/E)
- Return on Equity (ROE)
- Debt to Equity Ratio (DER)
- Pertumbuhan pendapatan 5 tahun terakhir

## Kesimpulan

Volatilitas adalah bagian alami dari pasar saham. Investor yang sukses adalah mereka yang tetap tenang, konsisten, dan berpegang pada strategi jangka panjang mereka.`,
    category: Category.stock,
    coverImageUrl: "/assets/generated/article-stock-market.dim_600x400.jpg",
    author: "principal-001",
    authorName: "Budi Santoso",
    publishedAt: "2025-01-15T08:00:00Z",
    tags: ["saham", "investasi", "strategi", "IHSG"],
    likes: 142,
    bookmarks: 38,
    comments: 24,
  },
  {
    id: BigInt(2),
    title: "Bitcoin Halving 2024: Dampak dan Proyeksi Harga Crypto Ke Depan",
    excerpt:
      "Event Bitcoin Halving yang terjadi April 2024 telah mengubah lanskap pasar kripto secara fundamental. Analis memprediksi siklus bull run baru yang lebih panjang.",
    content: `## Apa itu Bitcoin Halving?

Bitcoin Halving adalah peristiwa di mana reward yang diterima penambang Bitcoin berkurang setengahnya. Peristiwa ini terjadi setiap 210.000 blok, atau sekitar 4 tahun sekali.

## Dampak Historis Halving

Data historis menunjukkan pola yang konsisten:
- **2012**: BTC naik ~8,000% dalam 12 bulan pasca-halving
- **2016**: BTC naik ~3,000% dalam 18 bulan pasca-halving
- **2020**: BTC naik ~700% dalam 12 bulan pasca-halving

## Faktor Pendorong Bull Run 2025

### Bitcoin ETF
Persetujuan Bitcoin Spot ETF oleh SEC membuka pintu bagi institutional money yang masif. BlackRock, Fidelity, dan Invesco kini menawarkan produk crypto kepada klien institusional mereka.

### Adopsi Global
El Salvador, Argentina, dan beberapa negara Afrika telah mengadopsi Bitcoin sebagai alat pembayaran resmi.

## Risiko yang Perlu Diperhatikan

- Regulasi pemerintah yang berubah-ubah
- Ancaman kuantum computing terhadap enkripsi blockchain
- Manipulasi pasar oleh whale investors

## Proyeksi Analis

Beberapa analis terkemuka memproyeksikan Bitcoin bisa mencapai $150,000 - $200,000 di akhir siklus bull run ini, namun selalu ada risiko koreksi tajam hingga 70-80%.`,
    category: Category.crypto,
    coverImageUrl: "/assets/generated/article-crypto-bitcoin.dim_600x400.jpg",
    author: "principal-002",
    authorName: "Rina Wijaya",
    publishedAt: "2025-01-20T10:00:00Z",
    tags: ["bitcoin", "halving", "crypto", "bull run"],
    likes: 218,
    bookmarks: 67,
    comments: 45,
  },
  {
    id: BigInt(3),
    title:
      "Investasi Properti di Jakarta: Kawasan Mana yang Paling Menjanjikan?",
    excerpt:
      "Jakarta terus bertransformasi dengan proyek-proyek megah. Dari BSD City hingga Pluit, temukan kawasan properti dengan potensi capital gain tertinggi untuk 5 tahun ke depan.",
    content: `## Kondisi Pasar Properti Jakarta 2025

Meski terjadi pelemahan ekonomi global, pasar properti Jakarta menunjukkan resiliensi yang luar biasa. Proyek-proyek infrastruktur seperti MRT, LRT, dan jalan tol terus mendorong nilai properti di berbagai kawasan.

## Kawasan-Kawasan Unggulan

### 1. BSD City & Tangerang Selatan
Kawasan ini terus berkembang pesat dengan ekosistem yang lengkap: sekolah internasional, rumah sakit, pusat bisnis, dan pusat hiburan. Harga properti meningkat rata-rata 12% per tahun.

### 2. Bekasi & Cikarang
Dengan rencana pengembangan industri dan infrastruktur yang masif, properti di kawasan ini masih relatif terjangkau namun memiliki potensi pertumbuhan yang signifikan.

### 3. Jakarta Utara (Pluit & PIK 2)
PIK 2 adalah proyek ambisius yang mengubah wajah Jakarta Utara. Reklamasi lahan dengan fasilitas kelas dunia menarik minat investor dari berbagai penjuru.

## Tips Investasi Properti

1. **Lokasi adalah segalanya** - Akses transportasi publik sangat menentukan
2. **Cek pengembang** - Pilih developer dengan track record yang terbukti
3. **Pahami cashflow** - Hitung potensi rental yield sebelum beli
4. **Legalitas** - Pastikan SHM/HGB beres

## Kesimpulan

Investasi properti masih menjadi pilihan solid untuk jangka panjang, terutama di kawasan-kawasan yang didukung infrastruktur kuat.`,
    category: Category.property,
    coverImageUrl: "/assets/generated/article-property-jakarta.dim_600x400.jpg",
    author: "principal-003",
    authorName: "Dewi Kusuma",
    publishedAt: "2025-02-01T09:00:00Z",
    tags: ["properti", "jakarta", "investasi", "real estate"],
    likes: 98,
    bookmarks: 52,
    comments: 18,
  },
  {
    id: BigInt(4),
    title: "Mengatur Keuangan Pribadi: Metode 50/30/20 yang Terbukti Efektif",
    excerpt:
      "Hampir 70% milenial Indonesia tidak memiliki dana darurat yang cukup. Pelajari metode sederhana namun powerful untuk mengatur keuangan dan membangun kebebasan finansial.",
    content: `## Krisis Keuangan Milenial Indonesia

Survei terbaru menunjukkan bahwa 68% milenial Indonesia hidup dari gaji ke gaji, tanpa tabungan dan investasi yang memadai. Ini adalah alarm yang harus segera direspons.

## Metode 50/30/20 Explained

Metode ini pertama kali dipopulerkan oleh Senator Elizabeth Warren dalam bukunya "All Your Worth: The Ultimate Lifetime Money Plan".

**50% - Kebutuhan (Needs)**
- Biaya tempat tinggal
- Makanan dan minuman
- Transportasi
- Tagihan utilitas
- Minimum pembayaran utang

**30% - Keinginan (Wants)**
- Hiburan dan rekreasi
- Makan di restoran
- Belanja fashion
- Berlangganan streaming

**20% - Tabungan & Investasi (Savings)**
- Dana darurat (target 6x pengeluaran bulanan)
- Investasi reksa dana / saham
- Asuransi jiwa dan kesehatan
- Dana pensiun

## Adaptasi untuk Konteks Indonesia

Di kota besar seperti Jakarta, biaya hidup bisa sangat tinggi. Jika 50% tidak cukup untuk kebutuhan dasar, pertimbangkan untuk:
- Mencari sumber pendapatan tambahan
- Optimalisasi biaya tempat tinggal (share kost)
- Review gaya hidup secara berkala

## Tools yang Membantu

Beberapa aplikasi keuangan yang populer: Money Manager, Finansialku, dan Wallet by BudgetBakers dapat membantu tracking pengeluaran secara otomatis.`,
    category: Category.finance,
    coverImageUrl: "/assets/generated/article-finance-planning.dim_600x400.jpg",
    author: "principal-001",
    authorName: "Budi Santoso",
    publishedAt: "2025-02-10T11:00:00Z",
    tags: ["keuangan", "personal finance", "tabungan", "budgeting"],
    likes: 175,
    bookmarks: 89,
    comments: 31,
  },
  {
    id: BigInt(5),
    title: "Krisis 1998: Pelajaran Berharga dari Kehancuran Ekonomi Asia",
    excerpt:
      "Krisis moneter 1998 menghancurkan perekonomian Asia dalam hitungan bulan. Apa yang benar-benar terjadi, dan apa pelajaran yang masih relevan untuk investor modern?",
    content: `## Latar Belakang Krisis Asia 1997-1998

Krisis ekonomi Asia yang melanda pada 1997-1998 adalah salah satu bencana keuangan terbesar dalam sejarah modern. Bermula dari Thailand, krisis ini menyebar dengan cepat ke Indonesia, Korea Selatan, Malaysia, dan Filipina.

## Penyebab Krisis

### Peg Mata Uang yang Tidak Berkelanjutan
Banyak negara Asia mempertahankan nilai tukar tetap terhadap dolar AS. Ketika spekulan mulai menyerang, cadangan devisa terkuras habis.

### Utang Luar Negeri Swasta
Perusahaan-perusahaan Asia meminjam dalam dolar namun menghasilkan pendapatan dalam mata uang lokal. Ketika rupiah anjlok 80%, beban utang mereka melonjak luar biasa.

### Korupsi dan Nepotisme
Struktur ekonomi yang tidak transparan dan tata kelola perusahaan yang buruk memperdalam krisis.

## Dampak di Indonesia

- GDP Indonesia anjlok -13.7% pada 1998
- Inflasi mencapai 77%
- Pengangguran melonjak drastis
- Kerusuhan sosial meluas di berbagai kota
- Soeharto terpaksa mundur setelah 32 tahun berkuasa

## Pelajaran untuk Investor Modern

1. **Diversifikasi mata uang** - Jangan hanya memegang aset dalam satu mata uang
2. **Waspadai leverage berlebih** - Utang yang besar bisa menjadi bumerang
3. **Transparansi adalah kunci** - Perusahaan dengan governance buruk adalah red flag
4. **Dana darurat wajib ada** - Krisis bisa datang kapan saja

## Relevansi di Era Modern

Pelajaran dari krisis 1998 masih sangat relevan, terutama dalam konteks volatilitas global yang semakin tinggi akibat perang dagang, pandemi, dan perubahan iklim.`,
    category: Category.economicHistory,
    coverImageUrl: "/assets/generated/article-economic-history.dim_600x400.jpg",
    author: "principal-004",
    authorName: "Hendra Pratama",
    publishedAt: "2025-02-15T08:00:00Z",
    tags: ["sejarah ekonomi", "krisis 1998", "IMF", "Indonesia"],
    likes: 234,
    bookmarks: 112,
    comments: 56,
  },
  {
    id: BigInt(6),
    title: "Reksa Dana vs ETF: Mana yang Lebih Cocok untuk Investor Pemula?",
    excerpt:
      "Bagi pemula yang ingin mulai berinvestasi dengan modal kecil, reksa dana dan ETF adalah pilihan terbaik. Tapi apa perbedaan keduanya dan mana yang lebih menguntungkan?",
    content: `## Memahami Reksa Dana

Reksa dana adalah wadah investasi kolektif yang dikelola oleh Manajer Investasi (MI). Dana dari banyak investor dikumpulkan dan diinvestasikan ke berbagai instrumen sesuai dengan jenis reksa dananya.

**Jenis-jenis Reksa Dana:**
- Reksa Dana Pasar Uang
- Reksa Dana Pendapatan Tetap
- Reksa Dana Campuran
- Reksa Dana Saham

## Memahami ETF

Exchange Traded Fund (ETF) adalah reksa dana yang diperdagangkan di bursa saham seperti saham biasa. ETF biasanya mengikuti indeks tertentu (index fund).

**Keunggulan ETF:**
- Biaya manajemen lebih rendah
- Transparan - portofolio diketahui publik
- Fleksibilitas perdagangan intraday
- Tidak perlu modal besar

## Perbandingan Lengkap

| Aspek | Reksa Dana | ETF |
|-------|-----------|-----|
| Min. Investasi | Rp 10.000 | Rp 100 (1 lot) |
| Biaya | 1-3% per tahun | 0.15-0.5% per tahun |
| Likuiditas | D+1 sampai D+7 | Real-time |
| Pengelolaan | Aktif / Pasif | Pasif (umumnya) |

## Rekomendasi

Untuk pemula dengan modal terbatas dan belum familiar dengan pasar saham: **Reksa Dana Pasar Uang** adalah titik start yang ideal.

Untuk yang sudah punya rekening saham dan ingin biaya rendah: **ETF LQ45 atau IDX30** adalah pilihan cerdas.`,
    category: Category.finance,
    coverImageUrl:
      "/assets/generated/article-indonesia-economy.dim_600x400.jpg",
    author: "principal-002",
    authorName: "Rina Wijaya",
    publishedAt: "2025-03-01T09:00:00Z",
    tags: ["reksa dana", "ETF", "investasi", "pemula"],
    likes: 189,
    bookmarks: 94,
    comments: 38,
  },
];

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
