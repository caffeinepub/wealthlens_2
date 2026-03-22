# WealthLens

## Current State
WealthLens berjalan dengan fitur utama. Bug: error backend disembunyikan sehingga user tidak tahu penyebab kegagalan simpan profil/artikel.

## Requested Changes (Diff)

### Add
- Helper getProfileErrorMessage(error) untuk pesan error informatif
- Graceful degradation di useActor jika _initializeAccessControlWithSecret gagal

### Modify
- ProfileSettingsPage.tsx: tampilkan error spesifik dari backend
- ProfileSetupModal.tsx: tampilkan error spesifik dari backend
- useActor.ts: wrap _initializeAccessControlWithSecret dalam try/catch

### Remove
- Tidak ada

## Implementation Plan
1. Update useActor.ts: wrap init access control dalam try/catch, tetap return actor
2. Update ProfileSettingsPage.tsx: tambah getProfileErrorMessage, gunakan di catch
3. Update ProfileSetupModal.tsx: tambah getProfileErrorMessage, gunakan di catch
