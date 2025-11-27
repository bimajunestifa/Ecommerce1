# Fix GitHub Actions Submodule Error

## Masalah
Error: `fatal: No url found for submodule path 'storefront' in .gitmodules`

## Solusi yang Sudah Diterapkan

1. **Semua workflow menggunakan `submodules: false`**
   - File: `.github/workflows/ci.yml`
   - File: `.github/workflows/deploy.yml`

2. **File `.nojekyll`** untuk menonaktifkan Jekyll default

3. **Pastikan di GitHub Repository Settings:**
   - Buka: Settings → Pages
   - Pastikan "Source" tidak menggunakan "Deploy from a branch"
   - Atau jika menggunakan GitHub Actions, pastikan workflow yang benar yang dipilih

## Langkah Troubleshooting

Jika error masih terjadi:

1. **Hapus cache workflow di GitHub:**
   - Buka: Actions → Clear caches
   - Hapus semua cache yang ada

2. **Pastikan tidak ada file `.gitmodules` di repository:**
   ```bash
   git rm --cached .gitmodules  # jika ada
   git commit -m "Remove .gitmodules"
   git push
   ```

3. **Pastikan folder `storefront` bukan submodule:**
   ```bash
   git rm --cached storefront  # jika terdeteksi sebagai submodule
   git add storefront
   git commit -m "Convert storefront from submodule to regular folder"
   git push
   ```

4. **Restart workflow yang failed:**
   - Buka Actions di GitHub
   - Klik pada workflow run yang failed
   - Klik "Re-run jobs"

## Verifikasi

Setelah push, pastikan:
- ✅ Workflow baru muncul di tab Actions
- ✅ Tidak ada error submodule
- ✅ Build berjalan dengan sukses

