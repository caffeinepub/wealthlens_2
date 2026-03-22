# WealthLens

## Current State
Aplikasi blog investasi multi-penulis. Bug: ProfileSetupModal tidak muncul untuk pengguna baru karena pengecekan `userProfile === null` tidak menangkap `undefined`. Pesan error saat gagal publikasi artikel tidak informatif.

## Requested Changes (Diff)

### Add
- Pesan error spesifik dari backend ditampilkan saat artikel gagal disimpan

### Modify
- `ProfileSetupModal.tsx`: ubah `userProfile === null` menjadi `userProfile == null`
- `CreateEditArticlePage.tsx`: surface error message dari backend di catch block

### Remove
- Tidak ada

## Implementation Plan
1. Fix `ProfileSetupModal`: `showModal` condition dari `userProfile === null` ke `userProfile == null`
2. Fix `CreateEditArticlePage`: catch block menangkap dan menampilkan error message dari backend
