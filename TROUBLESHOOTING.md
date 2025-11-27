# 🔧 Troubleshooting Netlify Deployment

## ❌ Error yang Mungkin Terjadi

### 1. Build Script Returned Non-Zero Exit Code: 2

**Kemungkinan Penyebab:**
- TypeScript errors
- Missing dependencies
- Build configuration issues

**Solusi:**
1. Pastikan build lokal berhasil:
   ```bash
   cd storefront
   npm install
   npm run build
   ```

2. Jika build lokal berhasil tapi Netlify gagal:
   - Check build logs di Netlify dashboard
   - Pastikan Node version sesuai (20)
   - Pastikan semua dependencies ada di `package.json`

### 2. Plugin Not Found: @netlify/plugin-nextjs

**Solusi:**
1. Plugin akan otomatis terinstall oleh Netlify
2. Jika masih error, install manual di Netlify dashboard:
   - Buka **Site settings** → **Plugins**
   - Klik **"Install plugin"**
   - Cari **"Essential Next.js Plugin"** atau **"@netlify/plugin-nextjs"**
   - Install plugin

### 3. Module Not Found Errors

**Solusi:**
1. Pastikan semua dependencies ada di `package.json`
2. Jangan gunakan `package-lock.json` di root, hanya di `storefront/`
3. Pastikan `node_modules` ada di `.gitignore`

### 4. API Routes Not Working

**Solusi:**
1. Pastikan plugin Next.js terinstall
2. Check Function logs di Netlify dashboard
3. Pastikan route paths benar (`/api/...`)

### 5. TypeScript Errors

**Solusi:**
1. Fix semua TypeScript errors lokal:
   ```bash
   cd storefront
   npm run build
   ```

2. Pastikan `tsconfig.json` benar

## 🔍 Cara Check Build Logs di Netlify

1. Buka Netlify dashboard
2. Klik pada deployment yang failed
3. Scroll ke bagian **"Build logs"**
4. Cari error message yang spesifik
5. Copy error message untuk troubleshooting lebih lanjut

## ✅ Checklist Sebelum Deploy

- [ ] Build lokal berhasil: `npm run build`
- [ ] Tidak ada TypeScript errors
- [ ] Tidak ada ESLint errors yang blocking
- [ ] Semua dependencies ada di `package.json`
- [ ] File `netlify.toml` ada di root repository
- [ ] Base directory di `netlify.toml` sesuai (`storefront`)

## 🚀 Langkah Debugging

1. **Test build lokal:**
   ```bash
   cd storefront
   npm install
   npm run build
   ```

2. **Jika build lokal berhasil tapi Netlify gagal:**
   - Check build logs di Netlify
   - Pastikan environment variables sama
   - Pastikan Node version sama (20)

3. **Clear cache di Netlify:**
   - Buka **Site settings** → **Build & deploy** → **Clear cache**
   - Atau hapus `.netlify` folder (jika ada)

## 📞 Jika Masih Error

Berikan informasi berikut:
1. Error message lengkap dari build logs
2. Apakah build lokal berhasil?
3. Screenshot build logs (jika bisa)

---

**Perbaikan yang Sudah Dilakukan:**
- ✅ Fix TypeScript errors (imageRendering, useSearchParams)
- ✅ Update netlify.toml dengan Node version
- ✅ Add npm ci untuk clean install

