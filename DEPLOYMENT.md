# LiquidBridge — Panduan Deploy ke Vercel

Panduan lengkap dari nol sampai app live di Vercel production.

---

## Daftar Isi

1. [Prasyarat](#1-prasyarat)
2. [Persiapan WalletConnect Project ID](#2-persiapan-walletconnect-project-id)
3. [Persiapan Kode](#3-persiapan-kode)
4. [Install Vercel CLI](#4-install-vercel-cli)
5. [Login ke Vercel](#5-login-ke-vercel)
6. [Deploy Pertama (Setup)](#6-deploy-pertama-setup)
7. [Set Environment Variables](#7-set-environment-variables)
8. [Deploy ke Production](#8-deploy-ke-production)
9. [Verifikasi Setelah Deploy](#9-verifikasi-setelah-deploy)
10. [Deploy Ulang (Update)](#10-deploy-ulang-update)
11. [Troubleshooting](#11-troubleshooting)
12. [Struktur File Penting](#12-struktur-file-penting)

---

## 1. Prasyarat

Pastikan semua ini sudah terpasang di mesin lokal kamu:

| Tool | Versi Minimum | Cek |
|------|--------------|-----|
| Node.js | 18.x atau 20.x | `node -v` |
| npm | 9.x ke atas | `npm -v` |
| Git | bebas | `git -v` |

Pastikan juga kamu punya akun:
- **Vercel** — daftar gratis di [vercel.com](https://vercel.com)
- **WalletConnect** — daftar gratis di [cloud.walletconnect.com](https://cloud.walletconnect.com)
- **GitHub** (opsional tapi sangat dianjurkan) — untuk auto-deploy setiap kali push

---

## 2. Persiapan WalletConnect Project ID

App ini menggunakan RainbowKit yang butuh WalletConnect Project ID agar fitur wallet connect berfungsi di production. Tanpa ini, tombol "Connect Wallet" tidak akan bekerja.

### Langkah:

1. Buka [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Klik **Sign Up** (gratis) atau login jika sudah punya akun
3. Di dashboard, klik **Create Project**
4. Isi:
   - **Name**: `LiquidBridge`
   - **Type**: `App`
5. Klik **Create**
6. Di halaman project, copy **Project ID** — berupa string 32 karakter seperti:
   ```
   a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   ```
7. Simpan Project ID ini, akan dipakai di langkah 7

---

## 3. Persiapan Kode

### 3a. Pastikan di branch yang benar

```bash
cd /home/faiz/hackaton/9/liquidbridge

git status
git branch
```

Pastikan kamu di branch `frontend` atau branch yang mau di-deploy.

### 3b. Test build lokal dulu

Sebelum deploy, selalu test build lokal untuk memastikan tidak ada error:

```bash
cd /home/faiz/hackaton/9/liquidbridge/frontend

npm run build
```

Output yang diharapkan (sukses):
```
Route (app)
  ○ /
  ○ /_not-found
  ○ /liquidity
  ○ /pool
  ○ /portfolio
  ○ /trade

○  (Static)  prerendered as static content
```

Jika ada error TypeScript atau compile error, perbaiki dulu sebelum lanjut.

> **Catatan:** Warning `localStorage.getItem is not a function` saat build itu **normal** — ini adalah SSR behavior dari RainbowKit/wagmi dan tidak mempengaruhi fungsi app di browser.

### 3c. Cek file `.gitignore`

Pastikan `.env.local` ada di `.gitignore` agar API key tidak ter-commit:

```bash
cat /home/faiz/hackaton/9/liquidbridge/frontend/.gitignore
```

Pastikan ada baris:
```
.env.local
.env*.local
```

---

## 4. Install Vercel CLI

### Install global:

```bash
npm install -g vercel
```

### Verifikasi instalasi:

```bash
vercel --version
```

Harus muncul versi, contoh: `Vercel CLI 39.x.x`

---

## 5. Login ke Vercel

```bash
vercel login
```

Pilih metode login:
- `Continue with GitHub` — dianjurkan, nanti bisa auto-deploy
- `Continue with GitLab`
- `Continue with Bitbucket`
- `Continue with Email`

Setelah pilih, browser akan terbuka. Selesaikan login di browser, lalu kembali ke terminal — akan muncul:

```
Congratulations! You are now logged in.
```

---

## 6. Deploy Pertama (Setup)

### Masuk ke folder frontend:

```bash
cd /home/faiz/hackaton/9/liquidbridge/frontend
```

### Jalankan deploy:

```bash
vercel
```

Vercel akan menanyakan beberapa hal secara interaktif. Jawab seperti ini:

```
? Set up and deploy "~/...liquidbridge/frontend"? [Y/n]
> Y

? Which scope do you want to deploy to?
> [pilih akun kamu]

? Link to existing project? [y/N]
> N

? What's your project's name?
> liquidbridge

? In which directory is your code located? ./
> [tekan Enter, biarkan default ./]

? Want to modify these settings? [y/N]
> N
```

Vercel otomatis mendeteksi ini adalah **Next.js** project dari `vercel.json` dan `package.json`.

Setelah selesai, kamu akan dapat URL preview seperti:
```
https://liquidbridge-abc123.vercel.app
```

Deploy pertama ini masih **tanpa** environment variable, jadi wallet connect belum berfungsi. Lanjut ke langkah berikutnya.

---

## 7. Set Environment Variables

App frontend hanya butuh **satu** environment variable di Vercel:

| Variable | Keterangan | Contoh |
|----------|-----------|--------|
| `NEXT_PUBLIC_WC_PROJECT_ID` | WalletConnect Project ID dari langkah 2 | `a1b2c3d4e5f6...` |

> **Penting:** Variable lain di file `.env` root (`BASE_SEPOLIA_RPC_URL`, `PRIVATE_KEY`, `BASESCAN_API_KEY`) adalah untuk deployment kontrak Solidity via Hardhat — **jangan** di-set di Vercel, terutama `PRIVATE_KEY`.

### Cara set via CLI:

```bash
vercel env add NEXT_PUBLIC_WC_PROJECT_ID
```

Vercel akan tanya:
```
? What's the value of NEXT_PUBLIC_WC_PROJECT_ID?
> [paste Project ID dari WalletConnect]

? Add NEXT_PUBLIC_WC_PROJECT_ID to which Environments (select multiple)?
> [tekan Space untuk pilih] Production, Preview, Development
> [tekan Enter]
```

Pilih **ketiga environment** (Production, Preview, Development) agar variable aktif di semua kondisi.

### Verifikasi env var sudah tersimpan:

```bash
vercel env ls
```

Harus muncul:
```
NEXT_PUBLIC_WC_PROJECT_ID    Production, Preview, Development
```

### Cara alternatif — lewat Vercel Dashboard:

1. Buka [vercel.com/dashboard](https://vercel.com/dashboard)
2. Klik project `liquidbridge`
3. Masuk ke tab **Settings**
4. Klik **Environment Variables** di sidebar kiri
5. Klik **Add New**
6. Isi:
   - **Key**: `NEXT_PUBLIC_WC_PROJECT_ID`
   - **Value**: Project ID dari WalletConnect
   - **Environment**: centang Production, Preview, Development
7. Klik **Save**

---

## 8. Deploy ke Production

Setelah env var di-set, jalankan deploy production:

```bash
cd /home/faiz/hackaton/9/liquidbridge/frontend

vercel --prod
```

Proses ini akan:
1. Upload kode ke Vercel
2. Install dependencies (`npm install`)
3. Build Next.js (`npm run build`)
4. Deploy ke URL production

Output sukses:
```
Vercel CLI x.x.x
Deploying /home/.../frontend
Building ...
✓ Build Completed in 45s
✓ Deployed to production.

Production: https://liquidbridge.vercel.app [30s]
```

URL production inilah yang bisa kamu bagikan ke siapapun.

---

## 9. Verifikasi Setelah Deploy

Buka URL production dan cek semua fitur berikut:

### Checklist halaman:

- [ ] `/` — Landing page muncul, logo animasi float berjalan
- [ ] `/trade` — Halaman trade dengan SwapCard muncul
- [ ] `/pool` — Halaman Markets/Pool dengan chart muncul
- [ ] `/portfolio` — Halaman My Assets muncul
- [ ] `/liquidity` — Halaman Earn muncul

### Checklist fitur:

- [ ] Dark/light mode toggle berfungsi (tombol di navbar)
- [ ] Tombol "Connect Wallet" bisa diklik dan modal muncul
- [ ] WalletConnect QR code muncul (butuh Project ID valid)
- [ ] MetaMask bisa connect
- [ ] Data dari contract terbaca (harga NAV, pool reserves)

### Cek network di browser:

1. Buka DevTools (F12)
2. Tab **Console** — tidak ada error merah kritis
3. Tab **Network** — request ke Base Sepolia RPC berhasil (status 200)

---

## 10. Deploy Ulang (Update)

Setiap kali ada perubahan kode, cara update:

### Jika pakai GitHub (dianjurkan):

Jika project di-link ke GitHub repository, setiap `git push` ke branch `main` atau `frontend` akan otomatis trigger deploy di Vercel. Tidak perlu command tambahan.

```bash
git add .
git commit -m "pesan commit"
git push origin frontend
```

Vercel otomatis deploy dalam ~1 menit.

### Jika deploy manual via CLI:

```bash
cd /home/faiz/hackaton/9/liquidbridge/frontend

# Preview deploy (untuk test)
vercel

# Production deploy
vercel --prod
```

---

## 11. Troubleshooting

### Build gagal: TypeScript error

```
Type error: Property 'xxx' does not exist on type 'HTMLElement'
```

**Solusi:** Cast yang benar:
- Untuk `<button>` element: cast ke `HTMLButtonElement`
- Untuk `<input>` element: cast ke `HTMLInputElement`
- Untuk `<a>` element: cast ke `HTMLAnchorElement`

Contoh fix:
```tsx
// Salah:
const el = e.currentTarget as HTMLElement;
if (!el.disabled) { ... }

// Benar:
const el = e.currentTarget as HTMLButtonElement;
if (!el.disabled) { ... }
```

---

### Wallet connect tidak muncul / error

**Gejala:** Klik "Connect Wallet" tidak ada respon atau error di console.

**Penyebab:** `NEXT_PUBLIC_WC_PROJECT_ID` tidak di-set atau masih menggunakan `"demo-project-id"`.

**Solusi:**
1. Pastikan sudah set env var di langkah 7
2. Deploy ulang setelah set env var: `vercel --prod`
3. Hard refresh browser (Ctrl+Shift+R)

---

### Halaman blank / 500 error

**Gejala:** Halaman tidak muncul, error 500 di browser.

**Cek log:**
```bash
vercel logs https://liquidbridge-xxx.vercel.app
```

Atau di dashboard Vercel → project → tab **Deployments** → klik deployment → **View Function Logs**.

---

### Gambar/logo tidak muncul

**Gejala:** Logo `LogoLiquidBridgeTransparan.png` tidak tampil.

**Penyebab:** File tidak ada di `frontend/public/`.

**Cek:**
```bash
ls /home/faiz/hackaton/9/liquidbridge/frontend/public/
```

Harus ada `LogoLiquidBridgeTransparan.png`. Jika tidak ada, tambahkan ke folder `public/` dan commit.

---

### Vercel CLI tidak dikenali

```
command not found: vercel
```

**Solusi:**
```bash
npm install -g vercel
# atau
npx vercel
```

---

### Build lambat / timeout di Vercel

Vercel free tier punya limit build 45 menit. Proyek ini seharusnya build dalam 30-60 detik. Jika timeout:

1. Cek apakah `node_modules` ter-commit secara tidak sengaja: `git ls-files | grep node_modules`
2. Jika ada, tambahkan `node_modules` ke `.gitignore` dan hapus dari git: `git rm -r --cached node_modules`

---

## 12. Struktur File Penting

```
liquidbridge/
├── frontend/                          # Root project Next.js
│   ├── vercel.json                    # Konfigurasi Vercel (sudah ada)
│   ├── next.config.ts                 # COOP header untuk wallet (sudah ada)
│   ├── package.json                   # Dependencies & scripts
│   ├── tsconfig.json                  # TypeScript config
│   ├── .gitignore                     # Pastikan .env.local ada di sini
│   ├── public/
│   │   └── LogoLiquidBridgeTransparan.png  # Logo app
│   └── src/
│       ├── app/
│       │   ├── layout.tsx             # Root layout
│       │   ├── globals.css            # CSS variables & theme
│       │   ├── page.tsx               # Landing page (/)
│       │   ├── trade/page.tsx         # Halaman Trade
│       │   ├── pool/page.tsx          # Halaman Markets
│       │   ├── portfolio/page.tsx     # Halaman My Assets
│       │   └── liquidity/page.tsx     # Halaman Earn
│       ├── lib/
│       │   ├── wagmi.ts               # Wagmi config + WC Project ID
│       │   └── contracts.ts           # Contract addresses (Base Sepolia)
│       └── hooks/
│           ├── usePool.ts
│           ├── useNAV.ts
│           ├── useTokenBalances.ts
│           └── useCompliance.ts
└── DEPLOYMENT.md                      # File ini
```

### Environment Variables

Project ini punya file `.env` di root dengan 4 variable. Tapi **tidak semuanya untuk frontend/Vercel**:

| Variable | Dipakai Oleh | Perlu di Vercel? | Keterangan |
|----------|-------------|-----------------|-----------|
| `NEXT_PUBLIC_WC_PROJECT_ID` | Frontend (Next.js) | **Ya** | WalletConnect Project ID |
| `BASE_SEPOLIA_RPC_URL` | Contracts (Hardhat) | **Tidak** | Hanya untuk deploy kontrak |
| `PRIVATE_KEY` | Contracts (Hardhat) | **Tidak** | Hanya untuk deploy kontrak. Jangan pernah set ini di Vercel |
| `BASESCAN_API_KEY` | Contracts (Hardhat) | **Tidak** | Hanya untuk verifikasi kontrak di BaseScan |

Hanya `NEXT_PUBLIC_WC_PROJECT_ID` yang perlu di-set di Vercel. Sisanya hanya untuk workflow deployment kontrak Solidity, tidak dipakai oleh app frontend sama sekali.

Semua contract address sudah hardcoded di `src/lib/contracts.ts` untuk jaringan **Base Sepolia** — tidak perlu environment variable tambahan.

---

## Ringkasan Command

```bash
# 1. Test build lokal
cd /home/faiz/hackaton/9/liquidbridge/frontend
npm run build

# 2. Install Vercel CLI
npm install -g vercel

# 3. Login
vercel login

# 4. Deploy setup pertama
vercel

# 5. Set WalletConnect Project ID
vercel env add NEXT_PUBLIC_WC_PROJECT_ID

# 6. Deploy ke production
vercel --prod

# 7. Update setelah ada perubahan kode
vercel --prod
```

---

## Info Jaringan

App ini berjalan di **Base Sepolia** (testnet). Pastikan wallet di-set ke jaringan Base Sepolia:

| | |
|--|--|
| **Network Name** | Base Sepolia |
| **RPC URL** | https://sepolia.base.org |
| **Chain ID** | 84532 |
| **Currency Symbol** | ETH |
| **Block Explorer** | https://sepolia.basescan.org |

Untuk mendapatkan test ETH di Base Sepolia, gunakan faucet:
- [faucet.quicknode.com/base/sepolia](https://faucet.quicknode.com/base/sepolia)
- [www.alchemy.com/faucets/base-sepolia](https://www.alchemy.com/faucets/base-sepolia)
