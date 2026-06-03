# GasMania - Vercel Deployment

Dashboard monitoring gas/alkohol berbasis IoT dengan ESP32 + Supabase, di-deploy ke **Vercel**.

## Struktur Proyek

```
gasmania/
├── api/
│   └── sensor.js       ← Vercel Serverless Function (endpoint untuk ESP32)
├── index.html          ← Halaman dashboard utama
├── script.js           ← Logika frontend & Supabase Realtime
├── style.css           ← Styling
├── vercel.json         ← Konfigurasi Vercel (headers keamanan)
├── hardware            ← Kode firmware ESP32
└── sql                 ← SQL untuk setup Supabase
```

## Cara Deploy ke Vercel

### 1. Upload ke GitHub
1. Buat repository baru di GitHub (misal: `gasmania`)
2. Upload semua file ini ke repository tersebut

### 2. Deploy di Vercel
1. Login ke [vercel.com](https://vercel.com)
2. Klik **"Add New Project"** → Import dari GitHub
3. Pilih repository `gasmania`
4. Klik **Deploy** (tidak perlu ubah pengaturan apapun)

### 3. Set Environment Variables di Vercel
Setelah deploy, pergi ke **Settings → Environment Variables** dan tambahkan:

| Name | Value |
|------|-------|
| `SUPABASE_URL` | `https://xxxx.supabase.co` (URL Supabase kamu) |
| `SUPABASE_KEY` | `eyJ...` (Service Role Key atau Anon Key Supabase) |

Lalu **Redeploy** agar environment variables aktif.

### 4. Update URL di ESP32
Ganti URL endpoint di firmware ESP32 dari Cloudflare ke Vercel:
```
https://nama-project-kamu.vercel.app/api/sensor
```

## Endpoint API

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/sensor` | Menerima data BAC dari ESP32 |

### Contoh Request (dari ESP32)
```json
POST /api/sensor
Content-Type: application/json

{"bac": 0.05}
```

### Contoh Response
```json
{"success": true, "message": "Data terkirim ke Supabase"}
```

## Setup Supabase
Jalankan SQL yang ada di file `sql` di **Supabase SQL Editor** untuk membuat tabel dan mengaktifkan Realtime.
