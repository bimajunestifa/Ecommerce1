# 🚀 Instruksi Deploy ke Netlify

## ✅ Status Repository

Project sudah di-push ke GitHub:
- Repository: `https://github.com/bimajunestifa/Ecommerce1.git`
- Branch: `main`

## 📋 Langkah-langkah Deploy ke Netlify

### 1. Login/Daftar di Netlify

1. Buka browser dan kunjungi: **https://netlify.com**
2. Klik **"Sign up"** atau **"Log in"**
3. Pilih **"Sign up with GitHub"** (paling mudah)
4. Authorize Netlify untuk akses GitHub repository Anda

### 2. Import Project

1. Setelah login, klik tombol **"Add new site"** di dashboard
2. Pilih **"Import an existing project"**
3. Klik **"Deploy with GitHub"**
4. Jika diminta, authorize Netlify untuk akses GitHub
5. Pilih repository **Ecommerce1** dari daftar
6. Klik pada repository **Ecommerce1**

### 3. Konfigurasi Build Settings

Netlify akan otomatis detect Next.js, tapi pastikan settings berikut:

**Base directory:** `storefront`  
**Build command:** `npm run build`  
**Publish directory:** `.next` (akan di-handle otomatis oleh plugin)

**Atau** Netlify akan otomatis menggunakan file `netlify.toml` yang sudah saya buat, jadi tidak perlu set manual.

### 4. Deploy!

1. Klik tombol **"Deploy site"**
2. Tunggu proses build selesai (sekitar 2-5 menit)
3. Setelah selesai, Netlify akan memberikan URL seperti:
   - `https://random-name-12345.netlify.app`
   - Atau jika sudah set custom domain, akan muncul di sana

### 5. Set Custom Domain (Opsional)

1. Di Netlify dashboard, klik **Site settings**
2. Pergi ke tab **Domain management**
3. Klik **"Add custom domain"**
4. Masukkan domain Anda
5. Ikuti instruksi untuk setup DNS

## 🎉 Selesai!

Setelah deploy selesai:
- ✅ Aplikasi akan otomatis deploy setiap kali Anda push ke GitHub
- ✅ Preview deployments untuk setiap pull request
- ✅ HTTPS otomatis
- ✅ CDN global untuk performa cepat
- ✅ Semua fitur Next.js termasuk API routes akan bekerja

## 🔍 Verifikasi

Setelah deploy, test:
1. ✅ Buka URL yang diberikan Netlify
2. ✅ Test halaman beranda
3. ✅ Test login/register
4. ✅ Test API routes (misal: `/api/products`)
5. ✅ Test checkout flow
6. ✅ Test admin panel

## 📞 Troubleshooting

### Build Failed?

**Cek Build Logs:**
1. Di Netlify dashboard, klik pada deploy yang failed
2. Scroll ke bawah untuk melihat build logs
3. Cari error message dan fix sesuai

**Common Issues:**
- **Module not found**: Pastikan semua dependencies ada di `package.json`
- **Build command failed**: Pastikan `storefront` directory structure benar
- **API routes not working**: Pastikan plugin `@netlify/plugin-nextjs` terinstall

### API Routes Tidak Bekerja?

1. Pastikan plugin Next.js terinstall di Netlify
2. Check Function logs di Netlify dashboard: **Functions** tab
3. Pastikan route paths benar (harus `/api/...`)

### Butuh Bantuan?

- Check dokumentasi Netlify: https://docs.netlify.com
- Check log build di Netlify dashboard
- Test build lokal dulu: `cd storefront && npm run build`

---

**Selamat! Project Anda sekarang online di Netlify! 🎉**

