# Fix GitHub Actions Submodule Error

## Masalah
Error: `fatal: No url found for submodule path 'storefront' in .gitmodules`

## Solusi yang Sudah Diterapkan

### 1. Konfigurasi Workflow Files
Semua workflow files (`.github/workflows/*.yml`) telah diperbarui dengan:
- `submodules: false` - Nonaktifkan submodule checkout
- `submodules-recursive: false` - Nonaktifkan recursive submodule checkout
- `fetch-depth: 0` - Fetch full history untuk verifikasi
- Langkah verifikasi untuk memastikan tidak ada file `.gitmodules`

### 2. File yang Diperbarui
- ✅ `.github/workflows/pages.yml`
- ✅ `.github/workflows/deploy.yml`
- ✅ `.github/workflows/ci.yml`

### 3. Verifikasi Lokal
- ✅ Tidak ada file `.gitmodules` di repository
- ✅ Folder `storefront` ditrack sebagai regular files (bukan submodule)
- ✅ Semua file dalam `storefront` terlihat sebagai regular files dalam Git index

## Langkah Troubleshooting Jika Error Masih Terjadi

### 1. Clear GitHub Actions Cache
1. Buka repository di GitHub
2. Pergi ke **Settings** → **Actions** → **Caches**
3. Hapus semua cache yang ada
4. Atau gunakan GitHub CLI:
   ```bash
   gh cache list
   gh cache delete <cache-id>
   ```

### 2. Re-run Workflow yang Failed
1. Buka tab **Actions** di GitHub
2. Klik pada workflow run yang failed
3. Klik **Re-run jobs** → **Re-run failed jobs**

### 3. Pastikan File Sudah Di-push
Pastikan semua perubahan workflow files sudah di-push ke repository:
```bash
git add .github/workflows/
git commit -m "Fix: Disable submodules in all workflows"
git push
```

### 4. Hapus Cache Workflow di GitHub Repository
Jika masih error, coba:
1. Buka **Settings** → **Actions** → **General**
2. Scroll ke **Artifact and log retention**
3. Hapus artifacts yang lama jika perlu

### 5. Verifikasi Repository Settings
Pastikan di GitHub Repository:
- Buka **Settings** → **Pages**
- Pastikan source menggunakan **GitHub Actions** (bukan branch)
- Atau pilih branch yang benar jika menggunakan branch deployment

### 6. Force Re-checkout (Jika Masih Error)
Jika masalah masih terjadi, tambahkan langkah ini sebelum checkout:
```yaml
- name: Clean workspace
  run: rm -rf .git/modules/storefront 2>/dev/null || true
```

## Verifikasi Setelah Fix

Setelah push, pastikan:
- ✅ Workflow baru muncul di tab Actions
- ✅ Tidak ada error "No url found for submodule path"
- ✅ Build berjalan dengan sukses
- ✅ Langkah "Verify no submodules" menampilkan "✓ No .gitmodules file"

## Catatan Penting

1. **Folder `storefront` adalah regular directory**, bukan submodule
2. Konfigurasi `submodules: false` sudah ditambahkan di semua workflow
3. Jika error masih muncul, kemungkinan besar karena:
   - Cache GitHub Actions yang lama
   - Workflow files belum di-push
   - Repository settings yang perlu di-reset

## Kontak & Bantuan

Jika masalah masih berlanjut setelah mencoba semua langkah di atas:
1. Screenshot error message yang muncul
2. Periksa log lengkap dari workflow yang failed
3. Pastikan semua file workflow sudah ter-push ke repository

