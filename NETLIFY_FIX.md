# 🔧 Fix Netlify Deployment Error

## ⚠️ Masalah
Build terus gagal dengan error "Build script returned non-zero exit code: 2"

## ✅ Solusi yang Sudah Diterapkan

### 1. Update Build Command
- Mengubah dari `npm ci` ke `npm install` untuk menghindari masalah dengan package-lock.json
- Menghapus `--legacy-peer-deps` flag yang mungkin menyebabkan masalah

### 2. Pastikan Plugin Terinstall
Plugin `@netlify/plugin-nextjs` sudah dikonfigurasi di `netlify.toml`

## 🚨 Jika Masih Error, Coba Langkah Berikut:

### Langkah 1: Install Plugin Manual di Netlify Dashboard

1. Buka Netlify dashboard
2. Pilih site Anda
3. Pergi ke **Site settings** → **Plugins**
4. Klik **"Install plugin"**
5. Cari **"Essential Next.js Plugin"** atau **"@netlify/plugin-nextjs"**
6. Install plugin
7. **PENTING:** Ubah versi plugin ke **version 3** jika tersedia:
   - Di plugin settings, klik **"Change version"**
   - Pilih **version 3**
8. Redeploy site

### Langkah 2: Set Build Settings Manual di Dashboard

Jika `netlify.toml` tidak bekerja, set manual di dashboard:

1. Buka **Site settings** → **Build & deploy**
2. **Build settings:**
   - **Base directory:** `storefront`
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** (biarkan kosong, plugin akan handle)

### Langkah 3: Set Environment Variables

1. Buka **Site settings** → **Environment variables**
2. Tambahkan:
   - `NODE_VERSION` = `20`
   - `NPM_FLAGS` = (kosongkan)

### Langkah 4: Clear Cache dan Redeploy

1. Buka **Site settings** → **Build & deploy**
2. Scroll ke bawah, klik **"Clear cache"**
3. Klik **"Trigger deploy"** → **"Deploy site"**

## 📋 Checklist Debugging

Jika masih error, check di build logs:

1. **Error tentang plugin?**
   - → Install plugin manual (Langkah 1)

2. **Error tentang module not found?**
   - → Check apakah semua dependencies ada di `package.json`
   - → Test build lokal: `cd storefront && npm install && npm run build`

3. **Error tentang TypeScript?**
   - → Build sudah fixed, pastikan semua file sudah di-push

4. **Error tentang build command?**
   - → Set manual di dashboard (Langkah 2)

## 🔍 Cara Lihat Build Logs

1. Klik pada deployment yang failed
2. Scroll ke bagian **"Build logs"**
3. Cari error message yang spesifik
4. Copy error message untuk debugging lebih lanjut

## 💡 Alternative: Coba Vercel

Jika Netlify masih bermasalah setelah semua langkah di atas, Vercel mungkin lebih mudah:
- Vercel dibuat oleh tim Next.js
- Auto-detect Next.js tanpa konfigurasi
- Deploy lebih cepat dan reliable untuk Next.js

---

**Update terakhir:** Build command sudah diubah ke `npm install` dan NPM_FLAGS dihapus.

