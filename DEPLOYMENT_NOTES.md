# Catatan Deployment GitHub Pages

## ⚠️ MASALAH PENTING

Aplikasi ini menggunakan **Next.js API Routes** untuk:
- Authentication (login, register, logout)
- CRUD Products
- Orders Management
- Reviews
- Admin functions

**GitHub Pages hanya mendukung static files**, sehingga API routes **TIDAK AKAN BEKERJA** dengan static export.

## ✅ Solusi yang Direkomendasikan

### Opsi 1: Deploy ke Vercel (REKOMENDASI)
Vercel adalah platform yang dibuat oleh tim Next.js dan mendukung full Next.js features termasuk API routes.

**Langkah-langkah:**
1. Push kode ke GitHub
2. Daftar/login di [vercel.com](https://vercel.com)
3. Import repository GitHub Anda
4. Vercel akan otomatis detect Next.js dan deploy
5. Selesai! URL akan otomatis tersedia

**Keuntungan:**
- ✅ Full Next.js support (API routes, Server Components, dll)
- ✅ Auto-deploy setiap push
- ✅ Free tier yang generous
- ✅ Custom domain gratis
- ✅ SSL otomatis
- ✅ Edge Functions
- ✅ Analytics

### Opsi 2: Deploy ke Netlify
Netlify juga mendukung Next.js dengan baik.

**Langkah-langkah:**
1. Push kode ke GitHub
2. Daftar/login di [netlify.com](https://netlify.com)
3. Import repository
4. Build command: `cd storefront && npm run build`
5. Publish directory: `storefront/.next`

### Opsi 3: Tetap GitHub Pages (Hanya Frontend)
Jika tetap ingin menggunakan GitHub Pages, Anda perlu:
1. Memisahkan frontend dan backend
2. Deploy backend terpisah (misal ke Railway, Render, atau Heroku)
3. Update API calls untuk point ke backend URL

**Ini memerlukan refactor yang cukup besar.**

## 📝 Konfigurasi yang Sudah Dibuat

Saya sudah mengkonfigurasi:
- ✅ `output: 'export'` di `next.config.ts` untuk static export
- ✅ `basePath: '/Ecommerce1'` untuk GitHub Pages
- ✅ `trailingSlash: true` untuk kompatibilitas
- ✅ Image optimization disabled untuk static export
- ✅ Workflow GitHub Actions untuk deploy otomatis

## 🚀 Untuk Deploy ke Vercel (Paling Mudah)

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy dari terminal**:
   ```bash
   cd storefront
   vercel
   ```

3. **Atau deploy via web**:
   - Buka [vercel.com](https://vercel.com)
   - Klik "Import Project"
   - Pilih repository GitHub Anda
   - Vercel akan auto-configure
   - Klik "Deploy"

## ⚙️ Konfigurasi Vercel

Jika menggunakan Vercel, pastikan:
- **Root Directory**: `storefront`
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default untuk Next.js)

Vercel akan otomatis detect konfigurasi ini.

## 📋 Checklist Sebelum Deploy

- [ ] Pastikan semua environment variables sudah di-set (jika ada)
- [ ] Test aplikasi di local dengan `npm run build && npm start`
- [ ] Pastikan database JSON files sudah di-commit
- [ ] Test authentication flow
- [ ] Test CRUD operations

## 🔧 Troubleshooting

### Jika masih error 404 di GitHub Pages:
1. Pastikan workflow sudah berhasil di Actions tab
2. Check apakah folder `storefront/out` ada dan berisi `index.html`
3. Pastikan basePath sesuai dengan repository name
4. Check GitHub Pages settings: Settings → Pages → Source

### Jika API routes tidak bekerja:
- Ini normal untuk GitHub Pages static export
- Gunakan Vercel atau Netlify untuk full functionality

## 📞 Bantuan

Jika mengalami masalah:
1. Check log di GitHub Actions / Vercel dashboard
2. Test build lokal terlebih dahulu
3. Pastikan semua dependencies terinstall

