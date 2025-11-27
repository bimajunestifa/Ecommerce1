# 🚀 Panduan Deploy ke Netlify

## ✅ Keuntungan Netlify

- ✅ **Full Next.js Support** - API Routes bekerja dengan sempurna
- ✅ **Serverless Functions** - Untuk API routes Next.js
- ✅ **Auto-deploy** - Setiap push ke GitHub
- ✅ **Free SSL** - HTTPS otomatis
- ✅ **Custom Domain** - Domain gratis atau custom domain sendiri
- ✅ **Form Handling** - Built-in form handling
- ✅ **Edge Functions** - Untuk performa yang lebih cepat

## 📋 Langkah-langkah Deploy

### 1. Persiapkan Repository

Pastikan semua kode sudah di-push ke GitHub:
```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push
```

### 2. Daftar/Login ke Netlify

1. Buka [netlify.com](https://netlify.com)
2. Klik **"Sign up"** atau **"Log in"**
3. Pilih **"Sign up with GitHub"** (paling mudah)

### 3. Import Project dari GitHub

1. Setelah login, klik **"Add new site"** → **"Import an existing project"**
2. Klik **"Deploy with GitHub"**
3. Authorize Netlify untuk akses GitHub (jika diminta)
4. Pilih repository **Ecommerce** Anda
5. Klik **"Configure Netlify on this repository"** (jika muncul)
6. Klik **"Deploy site"**

### 4. Konfigurasi Build Settings

Netlify akan otomatis detect Next.js, tapi pastikan settings berikut:

**Build settings:**
- **Base directory**: `storefront`
- **Build command**: `npm run build`
- **Publish directory**: `.next`

Atau biarkan Netlify menggunakan file `netlify.toml` yang sudah saya buat (otomatis terdeteksi).

### 5. Install Netlify Next.js Plugin

Netlify akan otomatis menggunakan plugin `@netlify/plugin-nextjs` melalui `netlify.toml`.

Jika perlu install manual:
1. Di Netlify dashboard, buka **Site settings** → **Plugins**
2. Klik **"Install plugin"**
3. Cari **"Essential Next.js Plugin"**
4. Install plugin tersebut

### 6. Deploy!

Netlify akan otomatis:
1. Install dependencies
2. Build aplikasi
3. Deploy ke production
4. Berikan URL seperti: `https://your-site-name.netlify.app`

## ⚙️ Konfigurasi Tambahan (Opsional)

### Environment Variables

Jika ada environment variables yang diperlukan:

1. Di Netlify dashboard, buka **Site settings** → **Environment variables**
2. Tambahkan variables yang diperlukan, contoh:
   - `NODE_ENV=production`
   - Variable lainnya jika ada

### Custom Domain

1. Di Netlify dashboard, buka **Site settings** → **Domain management**
2. Klik **"Add custom domain"**
3. Masukkan domain Anda
4. Ikuti instruksi untuk setup DNS

### Automatic Deployments

Netlify akan otomatis deploy setiap kali:
- Push ke branch `main` atau `master` (production)
- Pull request dibuat (preview deployment)

Anda bisa konfigurasi di **Site settings** → **Build & deploy** → **Continuous Deployment**

## 🔍 Verifikasi Deployment

Setelah deploy selesai:

1. ✅ Buka URL yang diberikan Netlify
2. ✅ Test halaman beranda
3. ✅ Test login/register
4. ✅ Test API routes (misal: `/api/products`)
5. ✅ Test checkout flow
6. ✅ Test admin panel

## 🐛 Troubleshooting

### Build Failed

**Error: "Build command not found"**
- Pastikan **Base directory** di-set ke `storefront`
- Pastikan `package.json` ada di folder `storefront`

**Error: "Module not found"**
- Pastikan semua dependencies sudah di-list di `package.json`
- Run `npm install` lokal untuk memastikan tidak ada error

**Error: "API routes not working"**
- Pastikan plugin `@netlify/plugin-nextjs` sudah terinstall
- Pastikan `netlify.toml` sudah benar

### API Routes Tidak Bekerja

1. Pastikan plugin Next.js terinstall
2. Check function logs di Netlify dashboard: **Functions** tab
3. Pastikan route paths benar (harus `/api/...`)

### Images Tidak Muncul

1. Pastikan image URLs valid
2. Check `next.config.ts` untuk `remotePatterns`
3. Pastikan domain images sudah di-allow di Next.js config

## 📊 Monitoring

### Logs

Lihat build logs dan function logs di:
- **Site overview** → **Deploys** → Klik deploy → **Build log**
- **Functions** tab untuk API routes logs

### Analytics

Netlify menyediakan analytics gratis di:
- **Analytics** tab di dashboard

## 🎉 Selesai!

Setelah deploy sukses:
- ✅ Aplikasi akan auto-deploy setiap push
- ✅ Preview deployments untuk pull requests
- ✅ HTTPS otomatis
- ✅ CDN global untuk performa cepat

## 📞 Bantuan

Jika ada masalah:
1. Check logs di Netlify dashboard
2. Test build lokal: `cd storefront && npm run build`
3. Check dokumentasi Netlify: [docs.netlify.com](https://docs.netlify.com)

---

**Happy Deploying! 🚀**

