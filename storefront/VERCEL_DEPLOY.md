# Deploy BimaStore ke Vercel

1. Import repository ke Vercel.
2. Atur **Root Directory** menjadi `storefront`.
3. Framework Preset: **Next.js**.
4. Build Command: `npm run build`.
5. Jangan menambahkan `ENABLE_DATABASE_WRITES`, atau isi dengan `false`.

Tambahkan Environment Variables berikut di Vercel untuk keamanan halaman owner:

- `OWNER_EMAIL`: email login owner.
- `OWNER_PASSWORD`: password acak minimal 12 karakter.
- `OWNER_SESSION_SECRET`: secret acak minimal 32 karakter.

Jangan memakai kredensial pengembangan dari `.env.local` untuk situs produksi.

Katalog dibaca dari `data/products.json`. Keranjang, alamat checkout, pembayaran demo,
dan riwayat pesanan disimpan di `localStorage` browser. Dengan demikian demo dapat
berjalan tanpa database dan tanpa menulis ke filesystem Vercel.

Catatan: data pesanan hanya tersedia pada browser/perangkat yang membuat pesanan.
Untuk produksi multi-user, sambungkan database persisten sebelum menerima transaksi asli.
