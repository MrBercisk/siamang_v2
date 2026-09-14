# PROJECT_STATUS.md — SIAMANG

> Dokumen ini adalah peta kondisi project **saat ini**, dihasilkan dari analisis langsung terhadap source code (backend Laravel + frontend React), bukan dari asumsi nama file/folder. Terakhir dianalisis: source code hasil ekstrak `siamang.rar`.

---

## 1. Project Overview

**Nama Project:** SIAMANG (Sistem Informasi Aplikasi Magang)

**Tujuan:** Portal pendaftaran & manajemen magang untuk instansi pemerintah (DISKOMINFOSAN Kota Yogyakarta — terlihat dari branding di frontend). Mencakup alur: pendaftaran online oleh calon peserta magang → seleksi/verifikasi oleh admin → bimbingan oleh mentor → pelaporan & penilaian akhir.

**Masalah yang ingin diselesaikan:** Digitalisasi proses magang yang sebelumnya manual — mulai dari pendaftaran berkas, penempatan bidang/kategori, bimbingan berkala, logbook, hingga penerbitan nilai/sertifikat.

**Kondisi Saat Ini (Keseluruhan):** 🟡 **Sebagian / Perlu Penyempurnaan**

Project ini punya **dua kecepatan pengembangan yang timpang**:
- Backend baru menyelesaikan **Fase 1 (Autentikasi)** dan **Fase 2 (Master Data)**. Skema database untuk seluruh fase (termasuk fase pendaftaran, bimbingan, laporan, nilai) sudah dirancang penuh lewat migration, tapi **belum ada controller/route** untuk sebagian besar dari fase tersebut.
- Frontend sudah punya UI yang sangat lengkap untuk hampir semua peran (Pendaftar, Mentor, Admin) — tapi mayoritas layar Mentor & Admin, serta form pendaftaran, **masih memakai data contoh (mock) statis**, belum tersambung ke API backend. Bagian yang mencoba tersambung ke backend (auth & data landing page) memiliki **mismatch endpoint/format** dengan backend yang nyata (lihat §12).

**Stack Utama:** Laravel 13 (PHP 8.3) + Sanctum untuk backend/API; React 19 + Vite 6 + Tailwind 4 untuk frontend; MySQL 8 sebagai database; Docker Compose untuk orkestrasi lokal (backend, frontend, mysql, phpMyAdmin).

---

## 2. Technology Stack

| Bagian         | Teknologi | Status | Keterangan |
| -------------- | --------- | ------ | ---------- |
| Backend        | Laravel 13, PHP 8.3 | 🟢 | Struktur project standar Laravel, jalan di Docker `php:8.4-apache`. |
| Auth           | Laravel Sanctum (token, bukan cookie/SPA) | 🟢 | Register, login, logout, me — sudah berfungsi di sisi backend. |
| Frontend       | React 19 + TypeScript + Vite 6 | 🟢 | Tidak memakai React Router — navigasi antar "halaman" murni lewat state (`useState<PageType>`) di `App.tsx`. |
| Styling        | Tailwind CSS 4 | 🟢 | Dipakai konsisten di seluruh komponen. |
| Database       | MySQL 8 (via Docker) | 🟢 | Skema lengkap sudah dimigrasi; belum ada seeder untuk master data. |
| State Management (FE) | React hooks (`useState`, custom hooks) + `localStorage` | 🟡 | Tidak ada state management global (Redux/Zustand/Context); token & user & applications disimpan di `localStorage`. |
| Alert/UX Lib   | SweetAlert2 (`sweetalert2`) | 🟢 | Dipakai lewat wrapper `utils/swal.ts`. |
| Animasi        | `motion` (Framer Motion successor) | ⚪ | Ditemukan di dependency, penggunaan riil belum ditelusuri detail per komponen. |
| AI SDK         | `@google/genai` | ⚪ | Ada di dependency tapi **tidak ditemukan pemanggilan/pemakaiannya** di source `src/`. Perlu Verifikasi — kemungkinan sisa boilerplate template. |
| Deployment     | Docker Compose (backend, frontend, mysql, phpmyadmin) | 🟡 | Konfigurasi ada untuk dev lokal; belum ada konfigurasi untuk production (mis. build frontend statis, Nginx, CI/CD). |
| Testing        | PHPUnit (Laravel default) | 🔴 | Hanya file test contoh bawaan Laravel (`ExampleTest.php`), belum ada test nyata untuk fitur project. |

---

## 3. Current Project Structure

```text
siamang/
├── backend/                     # Laravel 13 API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/ # AuthController, BidangController,
│   │   │   │                    # KategoriController, PeriodeController,
│   │   │   │                    # LowonganController (hanya 5 file)
│   │   │   ├── Middleware/      # EnsureUserHasRole (alias 'role')
│   │   │   ├── Requests/Auth/   # LoginRequest, RegisterRequest
│   │   │   └── Resources/       # UserResource
│   │   ├── Models/              # 14 model — lengkap untuk semua fase
│   │   ├── Observers/           # ApplicationObserver, BimbinganObserver
│   │   │                        # (LOGIKA ADA, TAPI TIDAK TERDAFTAR)
│   │   └── Providers/AppServiceProvider.php  # boot() masih kosong
│   ├── database/
│   │   ├── migrations/          # 19 migration, mencakup seluruh skema
│   │   ├── factories/           # hanya UserFactory (default)
│   │   └── seeders/             # hanya DatabaseSeeder default (1 user dummy)
│   ├── routes/
│   │   ├── api.php              # hanya rute Fase 1 (auth) & Fase 2 (master data)
│   │   └── web.php              # hanya rute welcome page default
│   ├── config/                  # config Laravel standar (tanpa config/cors.php custom)
│   └── Dockerfile               # php:8.4-apache
│
├── frontend/                    # React + Vite SPA
│   ├── src/
│   │   ├── App.tsx              # root routing berbasis state, tanpa react-router
│   │   ├── lib/api.ts           # HTTP client + DATA DEFAULT/MOCK untuk landing page
│   │   ├── hooks/
│   │   │   ├── useAuth.ts       # login/register/logout — ADA FALLBACK SIMULASI
│   │   │   └── useInternshipData.ts # kategori/jadwal/syarat/aplikasi — mock + API (endpoint belum ada di backend)
│   │   ├── pages/                # HomePage, InfoPage, Login/Register/Reset,
│   │   │                         # DashboardPage (router peran: applicant/mentor/admin)
│   │   ├── components/
│   │   │   ├── admin/            # UI Portal Admin — 100% sample data (data/adminSampleData.ts)
│   │   │   ├── mentor/           # UI Portal Mentor — 100% sample data (data/mentorSampleData.ts)
│   │   │   └── pendaftar/        # UI Portal Pendaftar (form magang, progress, laporan, nilai) — state lokal only
│   │   └── data/                 # adminSampleData.ts, mentorSampleData.ts (mock data)
│   └── Dockerfile               # node:20-alpine, jalan `vite dev` (bukan build production)
│
└── docker-compose.yml            # backend (8001), frontend (3001), mysql (3308), phpmyadmin (8081)
```

**Fungsi folder penting:**
- `backend/app/Models` — representasi lengkap seluruh entitas bisnis (Bidang, Kategori, Periode, Lowongan, Application, TeamMember, DocumentFile, Bimbingan, ProgressItem, Laporan, Nilai, JadwalBimbingan, ForumMessage, Logbook, Announcement) — relasi Eloquent sudah didefinisikan dengan baik di masing-masing model.
- `backend/app/Http/Controllers/Api` — baru mencakup Auth + 4 Master Data. **Tidak ada controller** untuk Application, Bimbingan, Laporan, Nilai, JadwalBimbingan, ForumMessage, Logbook, Announcement, DocumentFile.
- `frontend/src/data` — sumber data untuk dashboard Mentor & Admin; ini **pengganti sementara** API yang belum ada.

---

## 4. Current Feature Status

| Fitur                              | Status | Implementasi | Catatan |
| ----------------------------------- | ------ | ------------- | ------- |
| Registrasi & Login (backend)        | 🟢     | `AuthController`, Sanctum token | Berfungsi di level backend. |
| Registrasi & Login (frontend↔backend)| 🟡    | `useAuth.ts` | Endpoint & format response **tidak cocok** dengan backend (lihat §12) — praktis selalu jatuh ke mode simulasi lokal. |
| Master Data (Bidang/Kategori/Periode/Lowongan) — backend | 🟢 | CRUD lengkap + role admin | Sudah termasuk validasi & proteksi delete (cegah hapus data yang masih direferensikan). |
| Master Data — frontend (publik)     | 🔴     | — | Landing page (`HomePage`, `InfoPage`) masih pakai `DEFAULT_CATEGORIES`/`DEFAULT_TIMELINE_SCHEDULES`/`DEFAULT_REQUIREMENTS` hardcoded di `lib/api.ts`, bukan hasil fetch dari `/bidangs`, `/kategoris`, `/periodes`. |
| Master Data — Admin panel (frontend)| 🟡     | `BidangAdminView.tsx`, `KategoriAdminView.tsx`, `PeriodeAdminView.tsx` | UI CRUD sudah ada, tapi **Perlu Verifikasi** apakah sudah connect ke endpoint backend asli atau masih sample data (lihat §8). |
| Pendaftaran Magang (form multi-step)| 🔴     | `PendaftaranFormView.tsx` | UI 5-step lengkap (Biodata, Tipe Pendaftaran, Bidang/Kategori, Berkas, Review) tapi submit hanya `setState` + alert sukses, **tidak ada request ke API sama sekali**. |
| Pendaftaran Magang (backend)        | 🔴     | — | Model `Application`, `TeamMember`, `DocumentFile` + migration sudah ada, tapi **tidak ada `ApplicationController` atau route** apa pun. |
| Auto role sync saat application diterima/ditolak | 🔴 | `ApplicationObserver` | Logika lengkap (ubah role user, auto-create Bimbingan) tapi **observer tidak pernah didaftarkan**, jadi tidak pernah berjalan. |
| Bimbingan (mentor-peserta)          | 🔴     | Model + migration ada | Tidak ada controller/route. UI mentor (`BimbinganTab.tsx`, dsb.) pakai sample data. |
| Progress/Logbook magang             | 🔴     | Model `ProgressItem`, `Logbook` + migration ada | Tidak ada controller/route. |
| Forum Diskusi (mentor↔peserta)      | 🔴     | Model `ForumMessage` + migration ada | UI ada (`ForumDiskusiTab.tsx`, `ForumDiskusiPesertaTab.tsx`) tapi tidak ada backend. |
| Laporan Akhir Magang                | 🔴     | Model `Laporan` + migration ada | UI ada (`LaporanMagangPesertaView.tsx`) tapi state lokal saja. |
| Penilaian (Nilai) & Predikat        | 🔴     | Model `Nilai` (dengan generated column `rata_rata` & helper `predikatFromRataRata`) | Logic perhitungan sudah disiapkan di model, tapi tidak ada controller/route untuk mengisi/menampilkan nilai dari DB. |
| Jadwal Bimbingan + Google Calendar sync | 🔴  | Model `JadwalBimbingan` (field `google_calendar_synced`, `google_calendar_event_id`) | Hanya kolom skema; **tidak ditemukan kode integrasi Google Calendar** di backend maupun frontend. |
| Pengumuman (Announcement)           | 🔴     | Model + migration ada | `AnnouncementBar.tsx` di frontend memakai teks hardcoded, bukan dari API. |
| Role switching UI (Admin/Mentor/Pendaftar) di dashboard | ⚪ | `DashboardPage.tsx` | Ada tombol switcher yang mengizinkan **user mana pun** berpindah tampilan ke Portal Admin/Mentor tanpa validasi role dari backend — jelas fitur *preview/demo*, bukan access control produksi. Perlu ditegaskan/dihapus sebelum rilis. |
| Upload berkas (dokumen pendaftaran) | 🔴     | Model `DocumentFile`, kolom `file_path` dsb. | Tidak ada endpoint upload/storage handler di backend; UI form hanya menyimpan nama file di state, tidak upload fisik. |

### Sudah Dibuat
- Autentikasi backend (register, login, logout, me) dengan Sanctum.
- CRUD Master Data backend: Bidang, Kategori, Periode, Lowongan (publik untuk read, admin-only untuk write).
- Middleware role-based access (`role:admin`) untuk melindungi endpoint admin.
- Skema database lengkap untuk seluruh alur bisnis (19 migration).
- UI frontend yang cukup lengkap untuk 3 peran (Pendaftar/Mentor/Admin), termasuk halaman landing, form pendaftaran multi-step, dashboard masing-masing peran.

### Sebagian Dibuat
- Integrasi Auth frontend↔backend — kode sudah mengarah ke backend tapi endpoint/format tidak sinkron.
- Model Eloquent untuk fitur lanjutan (Application, Bimbingan, dll.) — struktur & relasi lengkap, tapi tanpa controller/route yang memanfaatkannya.

### Belum Dibuat
- Semua controller/route untuk: Application (pendaftaran), Bimbingan, ProgressItem, Laporan, Nilai, JadwalBimbingan, ForumMessage, Logbook, Announcement, DocumentFile (upload berkas).
- Registrasi observer (`ApplicationObserver`, `BimbinganObserver`) di `AppServiceProvider`.
- Seeder untuk master data (Bidang/Kategori/Periode contoh) dan user admin/mentor default.
- Integrasi Google Calendar.
- Test otomatis (unit/feature) untuk fitur nyata.

### Perlu Verifikasi
- Apakah nama tabel custom di migration (singular: `bidang`, `kategori`, `periode`, `lowongan`, `application`, `team_member`) cocok dengan nama tabel default yang ditebak Eloquent (biasanya snake_case jamak dari nama model) — **tidak ada model yang meng-override `$table`**, jadi berpotensi terjadi error "table not found" saat runtime. Karena PHP tidak tersedia di lingkungan analisis ini untuk dijalankan langsung, ini ditandai Perlu Verifikasi, bukan bug pasti.
- Apakah komponen Admin panel (`BidangAdminView`, dst.) benar-benar memanggil endpoint backend Master Data yang sudah ada, atau masih pakai data lokal — perlu ditelusuri lebih detail per komponen saat lanjut development.
- Fungsi library `@google/genai` di `package.json` — tidak ditemukan pemakaiannya di kode, kemungkinan sisa dependency yang tidak terpakai.

---

## 5. Current System Flow

### Alur yang benar-benar berjalan (backend siap, frontend belum tersambung sempurna): Registrasi & Login

```text
User
  ↓
Form Register/Login (RegisterPage.tsx / LoginPage.tsx)
  ↓
useAuth.ts → apiRequest('/login' atau '/register')   ⚠️ path tidak cocok dgn backend (lihat §12)
  ↓
[Seharusnya] POST /api/auth/login atau /api/auth/register
  ↓
AuthController (validasi via LoginRequest/RegisterRequest)
  ↓
Model User (Eloquent) + Hash::check / Hash::make
  ↓
Sanctum createToken()
  ↓
Response { message, user, token }   ⚠️ frontend mengharapkan field 'access_token', bukan 'token'
```

### Alur Master Data (paling matang, backend siap penuh)

```text
Admin
  ↓
(Frontend Admin panel — perlu verifikasi koneksi API)
  ↓
POST/PUT/DELETE /api/bidangs (atau kategoris/periodes/lowongans)
  ↓
Middleware auth:sanctum + role:admin
  ↓
BidangController / KategoriController / PeriodeController / LowonganController
  ↓
Model Eloquent → Database (tabel bidang/kategori/periode/lowongan)
```

### Alur yang HANYA ada di frontend (belum ada backend sama sekali): Pendaftaran Magang

```text
Calon Peserta
  ↓
PendaftaranFormView.tsx (5 step: Biodata → Tipe Pendaftaran → Bidang/Kategori → Berkas → Review)
  ↓
handleSubmitFinal() → hanya setState lokal + SweetAlert sukses
  ↓
❌ Tidak ada request ke backend
❌ Tidak ada penyimpanan ke tabel `application`
```

### Alur yang dirancang tapi observer-nya mati: Perubahan Status Application → Sinkronisasi Role

```text
[Rencana] Admin mengubah application.status menjadi 'accepted'
  ↓
ApplicationObserver::updated()   ← LOGIKA SUDAH DITULIS
  ↓
Auto-create Bimbingan + update User.role menjadi 'intern'
  ↓
❌ TIDAK PERNAH TERPICU karena observer tidak didaftarkan di AppServiceProvider
```

---

## 6. Database Status

**Database:** MySQL 8 (nama default `siamang_db` sesuai `docker-compose.yml`, host `mysql`, port internal 3306 / expose 3308).

**Tabel yang sudah tersedia (19 migration, semua sudah dirancang lengkap dengan relasi):**

```text
users
  │
  ├── has many application (via user_id)
  ├── has many application (via mentor_id, sebagai mentor)
  ├── has many bimbingan (via mentor_id)
  ├── has many jadwal_bimbingan (via student_user_id & mentor_user_id)
  ├── has many logbooks
  └── has many forum_messages (via sender_id)

bidang
  └── has many kategori

kategori
  ├── belongs to bidang
  ├── has many lowongan
  └── has many application

periode
  ├── has many lowongan
  └── has many application

lowongan
  ├── belongs to periode, kategori
  └── has many application

application
  ├── belongs to user, periode, lowongan, bidang, kategori, mentor(user)
  ├── has many team_member
  ├── has many document_files
  └── has one bimbingan

bimbingan
  ├── belongs to application, mentor(user)
  ├── has many progress_items
  ├── has one laporan
  ├── has one nilai
  └── has many forum_messages

progress_items      → belongs to bimbingan
laporan             → belongs to bimbingan
nilai               → belongs to bimbingan (unique 1:1), rata_rata = generated column DB
jadwal_bimbingan    → belongs to users (student & mentor), berdiri sendiri
logbooks            → belongs to user
announcements       → tabel independen, tanpa relasi
personal_access_tokens → tabel bawaan Sanctum
```

**Field penting yang perlu dicatat:**
- `users.role` — enum `applicant | intern | admin | mentor | alumni`, dirancang untuk berubah otomatis via observer (saat ini observer tidak aktif → role harus diubah manual).
- `nilai.rata_rata` — **generated column** dihitung otomatis oleh MySQL dari 6 komponen nilai (kehadiran, kemampuan_kerja, kualitas_kerja, kerjasama, inisiatif_kreativitas, disiplin). Jangan diisi manual dari aplikasi.
- `application` punya `unique(['user_id', 'periode_id'])` — satu user hanya boleh 1 aplikasi per periode.

**Migration:** Semua migration sudah lengkap dan konsisten (foreign key, cascade/null on delete sudah dipikirkan dengan baik, misalnya `document_files` cascade saat `application` dihapus).

**Perlu Verifikasi:** Nama tabel custom (singular) vs konvensi default Eloquent — lihat §4 dan §12.

---

## 7. API / Route Status

Catatan dari kode: file `routes/api.php` secara eksplisit berkomentar bahwa isinya **baru mencakup Fase 1 (Auth) & Fase 2 (Master Data)**.

| Method | Endpoint                  | Fungsi                          | Status | Akses |
| ------ | -------------------------- | -------------------------------- | ------ | ----- |
| POST   | `/api/auth/register`       | Registrasi user baru             | 🟢     | Publik |
| POST   | `/api/auth/login`          | Login, dapat token Sanctum       | 🟢     | Publik |
| POST   | `/api/auth/logout`         | Cabut token yang sedang dipakai  | 🟢     | Auth (sanctum) |
| GET    | `/api/auth/me`             | Ambil data user + aplikasi aktif | 🟡     | Auth (sanctum) — bergantung relasi `currentApplication` yang belum ada di model `User` (lihat §12), berpotensi error. |
| GET    | `/api/periodes/active`     | Periode pendaftaran yang sedang buka | 🟢 | Publik |
| GET/POST/PUT/DELETE | `/api/bidangs`, `/api/kategoris`, `/api/periodes`, `/api/lowongans` | CRUD Master Data | 🟢 | GET publik; write khusus `role:admin` |

**Belum ada route (padahal model & migration sudah siap):**
- `/api/applications/*` — pendaftaran magang
- `/api/bimbingan/*`, `/api/progress-items/*`, `/api/laporan/*`, `/api/nilai/*`
- `/api/jadwal-bimbingan/*`
- `/api/forum-messages/*`
- `/api/logbooks/*`
- `/api/announcements/*`
- Upload dokumen (`document_files`)

**Endpoint yang dipanggil frontend tapi TIDAK ADA di backend sama sekali:**
- `GET /internships/categories`, `/internships/schedules`, `/internships/requirements`
- `GET /applications/my-status`, `POST /applications`
- `GET /login`, `POST /register`, `GET /user`, `POST /logout` (tanpa prefix `auth/`)

---

## 8. Frontend Status

**Halaman yang sudah dibuat:** Home, Info, Register, Login, Forgot Password, Reset Password, Dashboard (dengan 3 sub-portal: Pendaftar, Mentor, Admin).

**Navigasi:** 🟡 Tidak memakai React Router — seluruh navigasi dikontrol lewat satu state `currentPage` di `App.tsx`. Ini bekerja untuk skala kecil, tapi tidak scalable (tidak ada URL/deep-link per halaman, tidak ada browser back/forward yang benar, sulit di-share link).

**Form:**
- Login/Register form — 🟡 terhubung ke `useAuth`, tapi endpoint mismatch (lihat §12).
- Form pendaftaran magang 5-step (`PendaftaranFormView.tsx`) — 🔴 UI lengkap dengan validasi antar step, tapi submit akhir tidak memanggil API sama sekali.

**State management:** React hooks lokal per komponen + dua custom hook sentral (`useAuth`, `useInternshipData`) + `localStorage` untuk persist token/user/daftar aplikasi. Tidak ada global state library.

**API Integration:**
- `lib/api.ts` — wrapper `fetch` dengan header `Authorization: Bearer <token>`, sudah menangani auto-logout saat dapat 401. 🟢 secara desain sudah baik.
- Namun, **strategi fallback-nya berisiko**: setiap kegagalan `apiRequest` (termasuk error validasi asli dari backend, bukan cuma "server offline") ditangkap dan digantikan data dummy/simulasi, membuat aplikasi **terlihat berfungsi padahal tidak benar-benar tersambung ke backend**. Ini penting untuk disadari saat lanjut development, supaya tidak salah kira fitur sudah "selesai".

**Loading/error state:** Ada (`isLoading`, `error` di `useAuth`; `loading`, `error` di `useInternshipData`), tapi karena fallback selalu "berhasil", state error jarang benar-benar terpakai untuk auth/pendaftaran.

**Responsive behavior:** ⚪ Perlu Verifikasi — memakai Tailwind (mendukung responsive by default) tapi tidak ditelusuri per komponen apakah breakpoint sudah diuji di semua ukuran layar.

**Dashboard Admin & Mentor:** 🔴 Seluruhnya memakai data statis dari `data/adminSampleData.ts` dan `data/mentorSampleData.ts`. Tidak ada satu pun pemanggilan `apiRequest` di dalam komponen `components/admin/**` atau `components/mentor/**`.

**Role Switcher di Dashboard:** ⚪ Fitur `DashboardPage.tsx` yang membiarkan user mengganti tampilan Portal (Pendaftar/Mentor/Admin) lewat tombol UI, tanpa pengecekan role asli dari backend. Berguna untuk keperluan demo/preview, tapi **harus dihilangkan atau dikunci di balik role check nyata** sebelum ke produksi.

---

## 9. Backend Status

**Routes:** Terorganisir rapi di `routes/api.php` dengan komentar yang jelas menandakan cakupan fase. Prefix `/auth` untuk autentikasi, `apiResource` untuk master data dengan pemisahan method publik vs admin-only.

**Controllers:** 5 file, semua ringkas dan mengikuti pola yang konsisten (validasi inline via `$request->validate()` kecuali Auth yang pakai FormRequest terpisah). Response JSON konsisten dengan struktur `{ message, data }`.

**Models:** 14 model, semua pakai `HasFactory`, `$fillable` didefinisikan eksplisit (baik, menghindari mass-assignment vulnerability), relasi Eloquent lengkap dan masuk akal secara bisnis.

**Services/Business Logic terpisah:** 🔴 Tidak ada layer Service terpisah — logika bisnis (termasuk yang di Observer) langsung ditulis di Model/Observer/Controller. Untuk skala project ini masih wajar, tapi Fase 3+ (proses accept application → auto-assign mentor → auto-create bimbingan → auto-update kuota lowongan) sebaiknya dipikirkan sebagai Service class agar tidak menumpuk di Controller.

**Validasi:** Konsisten memakai Laravel Validator (baik lewat FormRequest atau inline), termasuk validasi unique dengan pengecualian ID saat update (`Rule::unique(...)->ignore($id)`).

**Authentication:** Sanctum token-based (bukan SPA cookie session) — cocok untuk arsitektur frontend-backend terpisah domain/port seperti sekarang (frontend :3001, backend :8001).

**Authorization:** Middleware `role:admin` (alias `EnsureUserHasRole`) sudah benar didaftarkan di `bootstrap/app.php` dan dipakai konsisten di route Master Data. Mendukung multi-role (`role:admin,mentor`) meski belum dipakai di route manapun saat ini.

**Error Handling:** `bootstrap/app.php` sudah mengatur agar semua request `api/*` selalu dapat response JSON (`shouldRenderJsonWhen`) — baik untuk konsistensi API.

**Isu spesifik yang ditemukan (lihat detail di §12 Known Issues):**
- Relasi `currentApplication` dipakai tapi tidak didefinisikan di model `User`.
- Field registrasi tambahan (`nim`, `institution`, `major`, `phone`) tidak ada di `$fillable` model `User`.
- Observer tidak terdaftar.

---

## 10. External Integration

| Integrasi | Untuk Apa | Bagian Kode | Status |
| --------- | --------- | ------------ | ------ |
| Google Calendar | Sinkronisasi jadwal bimbingan (kolom `google_calendar_synced`, `google_calendar_event_id` di tabel `jadwal_bimbingan`) | `app/Models/JadwalBimbingan.php` | 🔴 Hanya kolom skema, tidak ada kode integrasi (OAuth, API call, dsb). |
| Google Drive (link laporan) | Alternatif upload laporan lewat link | Kolom `link_google_drive` di tabel `laporan` | 🔴 Hanya kolom skema, tidak ada handler khusus. |
| Storage/File upload | Berkas pendaftaran (foto, transkrip, CV, dsb.), file presentasi progress, file laporan, form nilai, surat keterangan | Kolom `file_path`, `file_laporan`, `file_presentasi`, `surat_keterangan_path`, dsb. di berbagai tabel; `config/filesystems.php` (disk default: `local`, via `FILESYSTEM_DISK`) | 🔴 Skema siap, tapi tidak ada controller/handler upload yang menuliskan ke storage tersebut. |
| Email | Verifikasi email / notifikasi | `config/mail.php` (config default Laravel) | ⚪ Perlu Verifikasi — konfigurasi env ada, tapi tidak ditemukan pemanggilan `Mail::` atau Notification class di `app/`. |
| Payment Gateway | — | — | 🔴 Tidak relevan/tidak ditemukan — program magang ini tampaknya tidak berbayar. |

---

## 11. Deployment / Infrastructure Status

**Docker Compose** (`docker-compose.yml`) mendefinisikan 4 service:
- `backend` — build dari `backend/Dockerfile` (base `php:8.4-apache`), expose port host `8001` → container `80`, volume mount source code (hot-reload code, tapi tetap butuh restart untuk perubahan dependency).
- `frontend` — build dari `frontend/Dockerfile` (base `node:20-alpine`), menjalankan `npm run dev` (Vite dev server, **bukan build production**), expose `3001` → `3000`.
- `mysql` — image resmi `mysql:8.0`, expose `3308` → `3306`, dengan env kredensial hardcoded di compose file (`root_pass`, `siamang_pass`) — wajar untuk dev lokal, **jangan dipakai apa adanya di production**.
- `phpmyadmin` — akses GUI database, expose `8081`.

**Dockerfile backend:** Sudah menginstall ekstensi PHP yang relevan (`pdo_mysql`, `gd`, `intl`, `opcache`, dll.), mengaktifkan `mod_rewrite`, mengarahkan document root ke `public/` — konfigurasi sudah benar untuk menjalankan Laravel di Apache.

**Dockerfile frontend:** Sederhana, hanya untuk dev server. 🔴 Belum ada tahap build (`vite build`) + serve statis (mis. via Nginx) untuk skenario production.

**CI/CD:** 🔴 Tidak ditemukan konfigurasi GitHub Actions atau pipeline CI/CD lain.

**Environment Configuration:** `.env.example` tersedia dengan variabel standar Laravel (tanpa nilai sensitif — sesuai aturan, nilai tidak ditampilkan di sini). Variabel `DB_*` mengikuti default Laravel (`DB_HOST`, `DB_DATABASE`, dst.), perlu disesuaikan agar cocok dengan service `mysql` di `docker-compose.yml` (host `mysql`, bukan `127.0.0.1`, saat dijalankan di dalam container).

**CORS:** ⚪ Perlu Verifikasi — tidak ditemukan `config/cors.php` custom di project (kemungkinan memakai default bawaan Laravel). Karena arsitektur frontend & backend berbeda port (3001 vs 8001), konfigurasi CORS/`SANCTUM_STATEFUL_DOMAINS` perlu dipastikan benar-benar mengizinkan origin frontend saat pengujian nyata dilakukan.

---

## 12. Known Issues

| Masalah | Dampak | Status | Kategori |
| ------- | ------ | ------ | -------- |
| Endpoint auth frontend (`/login`, `/register`, `/user`, `/logout`) tidak cocok dengan backend (`/auth/login`, `/auth/register`, `/auth/me`, `/auth/logout`) | Request auth asli ke backend akan selalu gagal (404) | 🔴 Bug jelas (dapat dipastikan langsung dari kode) | Integration bug |
| Frontend mengharapkan field response `access_token`, backend mengembalikan `token` | Token tidak akan pernah terbaca dengan benar meski endpoint diperbaiki | 🔴 Bug jelas | Integration bug |
| `useAuth.ts` mengubah **setiap kegagalan** request login/register (termasuk penolakan sah dari backend, misal salah password) menjadi "login sukses" versi simulasi lokal | User bisa merasa berhasil login padahal sebenarnya tidak tervalidasi oleh backend sama sekali — risiko besar untuk keamanan & data integrity | 🔴 Bug jelas | Logic bug (fallback tidak membedakan "server mati" vs "ditolak backend") |
| Relasi `currentApplication` dipanggil di `AuthController` & `UserResource` tapi tidak didefinisikan di model `User` | Endpoint `/api/auth/login` dan `/api/auth/me` berpotensi throw error saat `->load('currentApplication')` dipanggil | 🔴 Bug jelas | Backend bug |
| Field `nim`, `institution`, `major`, `phone` divalidasi di `RegisterRequest` tapi tidak ada di `$fillable` model `User` | Data tersebut kemungkinan tidak tersimpan saat registrasi meski lolos validasi | 🔴 Bug jelas | Backend bug (mass assignment) |
| Observer `ApplicationObserver` & `BimbinganObserver` tidak didaftarkan di `AppServiceProvider` | Auto role-sync (applicant→intern→alumni) dan auto-create Bimbingan tidak akan pernah berjalan meski Fase 3 nanti dibangun, kecuali observer didaftarkan | 🔴 Bug jelas (dapat dipastikan dari kode: `boot()` kosong) | Backend bug / dead code |
| Model Master Data (Bidang, Kategori, Periode, Lowongan, Application, TeamMember) tidak override `$table`, sementara migration pakai nama tabel singular custom | Berpotensi error "table not found" saat query, tergantung hasil tebakan pluralization Eloquent — **tidak bisa dipastikan 100% tanpa menjalankan PHP** | ⚪ Perlu Verifikasi | Potential bug |
| Dashboard Admin & Mentor 100% memakai sample data statis | Semua fitur yang terlihat "jalan" di demo (kelola pendaftar, jadwal bimbingan, dsb.) belum benar-benar terhubung database | 🟡 Technical debt / belum diimplementasi | Scope gap |
| Form pendaftaran magang tidak mengirim data ke backend sama sekali | Data pendaftar tidak akan pernah tersimpan permanen di database | 🔴 Belum diimplementasi | Scope gap |
| Role switcher di `DashboardPage.tsx` memungkinkan siapa pun melihat Portal Admin/Mentor tanpa validasi role backend | Risiko keamanan/kebocoran tampilan data sensitif jika fitur ini terbawa ke production | 🟡 Perlu ditangani sebelum rilis | Security-relevant (untuk saat ini masih dev/demo) |
| CORS tidak ada konfigurasi eksplisit | Perlu dites langsung apakah request cross-origin (3001↔8001) benar-benar berhasil di browser | ⚪ Perlu dites | Configuration issue |
| Frontend Dockerfile hanya menjalankan dev server, bukan build production | Tidak siap dipakai untuk deployment production apa adanya | 🟡 Technical debt | Deployment gap |

---

## 13. TODO / Next Implementation

### 🔴 Priority 1 — Wajib

1. **Perbaiki integrasi Auth frontend↔backend**
   - Kenapa: Saat ini autentikasi asli tidak pernah benar-benar terjadi karena mismatch endpoint & format response.
   - Bagian yang disentuh: `frontend/src/lib/api.ts`, `frontend/src/hooks/useAuth.ts`, `frontend/src/types/auth.ts` (samakan field `access_token`/`token`), atau ubah backend agar mengembalikan `access_token` bila ingin frontend yang jadi acuan.
   - Gambaran implementasi: Samakan base path (`/auth/login`, `/auth/register`, `/auth/me`, `/auth/logout`), samakan nama field token, dan **ubah logika fallback** agar hanya aktif saat benar-benar tidak ada koneksi (network error), bukan saat backend menjawab dengan error valid (401/422).

2. **Tambahkan relasi `currentApplication` di model `User`, dan tambahkan `nim`/`institution`/`major`/`phone` ke `$fillable`**
   - Kenapa: Mencegah error runtime di endpoint login/me, dan memastikan data registrasi benar-benar tersimpan.
   - Bagian yang disentuh: `backend/app/Models/User.php`.

3. **Daftarkan `ApplicationObserver` dan `BimbinganObserver`**
   - Kenapa: Tanpa ini, mekanisme role-sync otomatis (inti dari desain PRD terkait role `applicant/intern/alumni`) tidak akan pernah berjalan.
   - Bagian yang disentuh: `backend/app/Providers/AppServiceProvider.php` (`boot()` — panggil `Application::observe(ApplicationObserver::class)` dan `Bimbingan::observe(BimbinganObserver::class)`, atau pakai atribut `#[ObservedBy]` di masing-masing model).

4. **Bangun `ApplicationController` + routes untuk pendaftaran magang (Fase 3)**
   - Kenapa: Ini fitur inti yang belum ada backend-nya sama sekali, padahal skema & UI sudah siap.
   - Bagian yang disentuh: buat `app/Http/Controllers/Api/ApplicationController.php`, `app/Http/Requests/Application/*`, tambahkan route baru di `routes/api.php` (mengikuti pola komentar "Fase 3" yang sudah ada).
   - Gambaran implementasi: endpoint submit pendaftaran (termasuk anggota tim untuk `registration_type = Kelompok`), endpoint upload dokumen (`document_files`), endpoint admin untuk review/accept/reject (yang akan memicu observer di atas).

5. **Verifikasi kecocokan nama tabel Eloquent vs migration**
   - Kenapa: Berpotensi jadi bug fatal yang menghalangi seluruh fitur Master Data & Application berjalan.
   - Bagian yang disentuh: `backend/app/Models/Bidang.php`, `Kategori.php`, `Periode.php`, `Lowongan.php`, `Application.php`, `TeamMember.php`.
   - Gambaran implementasi: jalankan `php artisan tinker` lalu coba `Bidang::first()` dsb., atau tambahkan `protected $table = 'bidang';` secara eksplisit di tiap model agar tidak bergantung pada tebakan konvensi.

### 🟡 Priority 2 — Penting

6. **Hubungkan Admin & Mentor dashboard ke API asli (ganti sample data)**
   - Bagian yang disentuh: `frontend/src/components/admin/**`, `frontend/src/components/mentor/**`, buat hook baru serupa `useInternshipData` untuk masing-masing domain (mis. `useApplications`, `useBimbingan`).

7. **Implementasikan controller untuk Bimbingan, ProgressItem, Laporan, Nilai, JadwalBimbingan, ForumMessage, Logbook, Announcement**
   - Bagian yang disentuh: `app/Http/Controllers/Api/*`, `routes/api.php`.

8. **Implementasikan upload berkas nyata** (pas foto, berkas persyaratan, laporan, form nilai, surat keterangan)
   - Bagian yang disentuh: controller terkait + `config/filesystems.php` (tentukan disk: local/S3).

9. **Buat seeder untuk master data & user default** (admin, mentor, beberapa Bidang/Kategori/Periode contoh)
   - Bagian yang disentuh: `database/seeders/DatabaseSeeder.php` + seeder baru.

10. **Tegaskan/hilangkan Role Switcher di dashboard** sebelum ke tahap staging/production, ganti dengan role check dari data user backend asli.
    - Bagian yang disentuh: `frontend/src/pages/DashboardPage.tsx`.

### 🟢 Priority 3 — Enhancement

11. Pertimbangkan migrasi navigasi frontend ke React Router untuk deep-linking dan riwayat browser yang benar.
12. Tambahkan test otomatis (Feature test Laravel) untuk endpoint yang sudah ada (Auth, Master Data) sebelum menambah fitur baru.
13. Siapkan Dockerfile frontend versi production (`vite build` + Nginx) dan pipeline CI/CD dasar.
14. Evaluasi apakah dependency `@google/genai` masih dibutuhkan; hapus jika tidak dipakai untuk mengurangi bundle size.
15. Implementasikan integrasi Google Calendar untuk `JadwalBimbingan` jika fitur ini memang masih diperlukan sesuai PRD.

---

## 14. Suggested Implementation Roadmap

```text
Current State (Fase 1 & 2 backend selesai, UI hampir lengkap tapi banyak mock)
     ↓
Perbaiki bug integrasi Auth (endpoint, format, fallback logic)
     ↓
Perbaiki bug backend kecil (relasi currentApplication, fillable User, observer registration)
     ↓
Verifikasi & (bila perlu) perbaiki nama tabel Eloquent
     ↓
Bangun Fase 3: Controller Application + upload dokumen + koneksi form pendaftaran frontend
     ↓
Bangun Fase 4: Controller Bimbingan, Progress, Laporan, Nilai, Jadwal, Forum, Logbook
     ↓
Ganti seluruh sample data Admin/Mentor dengan data API asli
     ↓
Tegaskan role-based access nyata (hapus/kunci Role Switcher demo)
     ↓
Tambah test otomatis untuk endpoint kritis
     ↓
Siapkan build production frontend + deployment pipeline
     ↓
Production ready
```

---

## 15. Implementation Notes

- **Pola arsitektur backend:** Laravel standar (Controller tipis, validasi inline/FormRequest, Model dengan relasi eksplisit). Belum ada Service/Repository layer — masih wajar untuk ukuran project saat ini, tapi pertimbangkan menambahkannya saat logika Fase 3 (accept application → auto-assign mentor → update kuota lowongan) mulai kompleks.
- **Konvensi penamaan:** Backend konsisten memakai istilah Bahasa Indonesia untuk nama tabel/model bisnis (`bidang`, `kategori`, `periode`, `lowongan`, `bimbingan`, dst.), sementara nama tabel Laravel bawaan (users, sessions, cache) tetap Bahasa Inggris standar. **Tabel-tabel bisnis sengaja dibuat singular** — developer lanjutan harus konsisten menambahkan `protected $table` di model baru mengikuti pola ini, jangan mengandalkan tebakan default Eloquent.
- **Cara frontend berkomunikasi dengan backend:** Semua request API terpusat lewat `frontend/src/lib/api.ts` (`apiRequest`). **Jangan** memanggil `fetch` langsung dari komponen — ikuti pola yang sudah ada agar header Authorization & auto-logout-on-401 tetap konsisten.
- **Waspadai pola fallback silent di frontend:** Banyak hook (`useAuth`, `useInternshipData`) sengaja dirancang untuk tetap "terlihat berfungsi" walau backend tidak merespons (mode preview/demo). Ini memudahkan demo UI, tapi **menyembunyikan bug integrasi nyata** — saat menyambungkan fitur baru ke backend, selalu cek Network tab browser untuk memastikan request benar-benar berhasil, jangan percaya tampilan UI saja.
- **Auth flow:** Token-based (Sanctum `personal_access_tokens`), bukan cookie/session SPA. Artinya tidak perlu `SANCTUM_STATEFUL_DOMAINS` untuk CSRF cookie flow, tapi tetap perlu CORS yang benar agar header `Authorization` bisa dikirim dari origin frontend.
- **Struktur database:** `nilai.rata_rata` adalah **generated column** — jangan pernah mencoba mengisinya lewat `$fillable`/mass assignment, biarkan MySQL yang menghitung.
- **Dependency penting yang jangan diubah sembarangan:** Middleware alias `role` di `bootstrap/app.php` — dipakai di banyak route Master Data; mengubah nama alias ini butuh update di semua route sekaligus.
- **Ketergantungan antar fitur:** Fitur Bimbingan/Progress/Laporan/Nilai semuanya bergantung pada `Application` yang berstatus `accepted` DAN observer yang aktif. Mengimplementasikan Fase 3+ tanpa memperbaiki observer registration (Priority 1 §13) akan membuat fitur-fitur itu tidak pernah ter-trigger secara otomatis.

---

## 16. Current Progress Summary

```text
Overall Progress: sekitar 30–35% (perkiraan berdasarkan jumlah fase/controller yang selesai
                   dari total skema yang sudah dirancang — backend Fase 1-2 dari 4+ fase,
                   frontend UI ~80% selesai secara visual tapi sebagian besar belum
                   terhubung data nyata)

🟢 Completed:
- Backend: Autentikasi (register/login/logout/me) via Sanctum
- Backend: CRUD Master Data (Bidang, Kategori, Periode, Lowongan) + role-based access
- Database: Skema lengkap untuk seluruh alur bisnis (19 migration)
- Frontend: UI lengkap untuk landing page, auth pages, dan dashboard 3 peran (visual/layout)

🟡 In Progress:
- Integrasi Auth frontend↔backend (kode ada, tapi endpoint & format tidak sinkron)
- Admin panel Master Data di frontend (perlu verifikasi koneksi API asli)

🔴 Not Started:
- Controller/route untuk: Application, Bimbingan, ProgressItem, Laporan, Nilai,
  JadwalBimbingan, ForumMessage, Logbook, Announcement
- Upload berkas nyata (storage handler)
- Registrasi Observer (ApplicationObserver, BimbinganObserver)
- Seeder master data & user default
- Integrasi Google Calendar
- Test otomatis fitur nyata
- Build production frontend + CI/CD

⚪ Needs Verification:
- Kecocokan nama tabel Eloquent (default guess) vs nama tabel custom di migration
- Apakah komponen Admin panel sudah connect API atau masih sample data
- Konfigurasi CORS untuk request cross-origin frontend↔backend
- Pemakaian nyata dependency `@google/genai`
```
