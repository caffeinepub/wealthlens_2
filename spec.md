# WealthLens

## Current State
Field cover image di halaman `CreateEditArticlePage.tsx` hanya berupa input teks URL (`Input` biasa). Tidak ada opsi upload file gambar dari perangkat lokal. Blob storage sudah dipilih sebagai komponen.

## Requested Changes (Diff)

### Add
- Komponen `CoverImagePicker.tsx`: UI dengan dua tab/pilihan -- "Upload File" dan "Paste URL"
- Integrasi `blob-storage` untuk upload gambar cover artikel
- Preview gambar yang sudah dipilih/diupload

### Modify
- `CreateEditArticlePage.tsx`: ganti field `coverImageUrl` (plain input) dengan komponen `CoverImagePicker`

### Remove
- Tidak ada

## Implementation Plan
1. Buat komponen `CoverImagePicker.tsx` dengan dua mode: tab "Upload" (file picker + blob storage upload) dan tab "URL" (input teks biasa)
2. Tampilkan preview gambar setelah dipilih/diinput
3. Integrasikan komponen ke `CreateEditArticlePage.tsx` menggantikan field URL lama
