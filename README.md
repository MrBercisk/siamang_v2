# SIAMANG

**Sistem Informasi Aplikasi Magang DISKOMINFOSAN Kota Yogyakarta**

SIAMANG adalah aplikasi web untuk mengelola proses magang, mulai dari informasi program dan pendaftaran hingga seleksi administrasi serta kegiatan peserta selama magang. Aplikasi terdiri dari frontend React dan REST API Laravel.

> Status: aktif dikembangkan. Ketersediaan fitur dapat berbeda antara tampilan frontend dan API; belum semua alur siap untuk penggunaan produksi.

## Fitur

- Registrasi, login, reset kata sandi, dan autentikasi berbasis token.
- Informasi bidang, kategori, periode magang, dan lowongan.
- Pengajuan dan pelacakan pendaftaran magang.
- Pengelolaan pendaftar, mentor, penempatan, dan jadwal oleh admin.
- Dashboard mentor untuk bimbingan, forum, laporan, dan penilaian.
- Dashboard peserta untuk melihat progres, jadwal, forum, laporan, dan nilai.
- Asisten AI untuk peserta magang melalui workflow n8n.
- Antarmuka berbasis peran: admin, mentor, pendaftar, dan peserta magang.

Sebagian halaman atau integrasi mungkin masih dalam pengembangan. Untuk mengetahui status terbaru, periksa implementasi di `frontend/src` dan route API di `backend/routes/api.php`.

## Teknologi

| Komponen | Teknologi |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4 |
| Backend | Laravel 13, PHP 8.3+, Laravel Sanctum |
| Database | MySQL 8 |
| Development | Docker Compose |

## Struktur Project

```text
siamang/
├── backend/          # REST API Laravel
├── frontend/         # Aplikasi React + Vite
├── docker-compose.yml
└── README.md
```

## Menjalankan dengan Docker

### Prasyarat

- Docker Engine atau Docker Desktop
- Docker Compose

### Langkah-langkah

1. Clone repository dan masuk ke folder project:

   ```bash
   git clone <URL-REPOSITORY>
   cd siamang
   ```

2. Buat file konfigurasi backend:

   ```bash
   cp backend/.env.example backend/.env
   ```

   Atur konfigurasi database di `backend/.env` agar sesuai dengan service MySQL pada `docker-compose.yml`:

   ```dotenv
   APP_URL=http://localhost:8001
   DB_CONNECTION=mysql
   DB_HOST=mysql
   DB_PORT=3306
   DB_DATABASE=siamang_db
   DB_USERNAME=siamang_user
   DB_PASSWORD=siamang_pass
   N8N_WEBHOOK_URL=https://<HOST-N8N>/webhook/<WEBHOOK-PATH>
   ```

   `N8N_WEBHOOK_URL` harus menunjuk ke webhook workflow n8n yang aktif. Workflow menerima `message`, `token`, dan `session_id`, lalu mengembalikan respons JSON dengan `success` dan `message`. Endpoint chat tersedia bagi pengguna yang sudah login dengan role `intern`.

   Nilai database di atas hanya untuk development lokal. Ganti seluruh kredensial dan konfigurasi sebelum deployment.

3. Buat `frontend/.env` untuk mengarahkan frontend ke API lokal:

   ```dotenv
   VITE_API_BASE_URL=http://localhost:8001/api
   VITE_API_ORIGIN=http://localhost:8001
   ```

4. Build dan jalankan container:

   ```bash
   docker compose up --build -d
   ```

5. Pasang dependency backend, buat application key, lalu jalankan migration:

   ```bash
   docker compose exec backend composer install
   docker compose exec backend php artisan key:generate
   docker compose exec backend php artisan migrate
   ```

   Jika database belum siap saat migration pertama dijalankan, tunggu service MySQL siap lalu ulangi perintah migration.

### Alamat lokal

| Service | Alamat |
| --- | --- |
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:8001/api |
| phpMyAdmin | http://localhost:8081 |
| MySQL dari host | `127.0.0.1:3308` |

Perintah berguna:

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose down
```

## Menjalankan Tanpa Docker

### Backend

Prasyarat: PHP 8.3+, Composer, dan MySQL 8.

```bash
cd backend
cp .env.example .env
composer install
```

Atur koneksi database pada `backend/.env`, kemudian jalankan:

```bash
php artisan key:generate
php artisan migrate
php artisan serve --host=0.0.0.0 --port=8001
```

### Frontend

Prasyarat: Node.js 20+ dan npm.

Atur `frontend/.env` seperti konfigurasi API pada bagian Docker, lalu:

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

Buka http://localhost:3000. Perintah `npm run build` membuat build frontend untuk pemeriksaan/build lokal; konfigurasi Compose saat ini menjalankan Vite development server.

## Pengembangan

Jalankan pemeriksaan TypeScript frontend:

```bash
cd frontend
npm run lint
```

Jalankan test backend:

```bash
cd backend
php artisan test
```

Sebelum mengirim perubahan, jangan sertakan file `.env`, token, atau kredensial pribadi. Konfigurasi dan password yang ada di Docker Compose ditujukan untuk development lokal saja.