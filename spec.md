# WealthLens

## Current State
WealthLens adalah komunitas blog dengan fitur artikel, komentar, like, bookmark, dan dashboard penulis. Penulis login via Internet Identity. UserProfile saat ini hanya menyimpan `name` dan `role`. Tidak ada halaman profil publik atau halaman pengaturan profil.

## Requested Changes (Diff)

### Add
- Field `bio: Text` dan `photoUrl: Text` ke tipe `UserProfile` di backend
- Fungsi backend `getPublicAuthorProfile(principal)` -- publik, tanpa autentikasi
- Halaman `/profile` -- halaman pengaturan profil penulis (edit nama, bio, foto)
- Halaman `/author/$principalId` -- halaman profil publik penulis + daftar artikel mereka
- Blob storage untuk upload foto profil

### Modify
- Navigasi: tambah link "Profil" di menu penulis yang sudah login
- `saveCallerUserProfile` menerima profil yang sudah diperbarui dengan field baru

### Remove
- Tidak ada yang dihapus

## Implementation Plan
1. Update tipe `UserProfile` di backend: tambah `bio` dan `photoUrl`
2. Tambah fungsi `getPublicAuthorProfile(principal)` yang bisa dipanggil siapa saja
3. Select blob-storage component untuk upload foto profil
4. Regenerate backend bindings
5. Buat halaman `ProfileSettingsPage` untuk edit profil penulis
6. Buat halaman `AuthorProfilePage` untuk tampilan profil publik + artikel penulis
7. Tambah routes `/profile` dan `/author/$principalId` di App.tsx
8. Update navigasi untuk penulis yang login
