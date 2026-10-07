# Kaboot - Frontend Technical Test By [Ibrahim Gunawan]

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack & Dependencies](#-tech-stack--dependencies)
- [Prasyarat Sistem](#-prasyarat-sistem)
- [Instalasi & Menjalankan Proyek](#-instalasi--menjalankan-proyek)
- [Konfigurasi Environment Variable](#-konfigurasi-environment-variable)
- [Akun Demo (Authentication)](#-akun-demo-authentication)
- [Struktur Direktori](#-struktur-direktori)
- [Skrip NPM yang Tersedia](#-skrip-npm-yang-tersedia)

---

## ✨ Fitur Utama

1. **Autentikasi & Proteksi Rute (Session via JWT)**:
   - Login berbasis form dengan validasi schema menggunakan **Zod**.
   - Penyimpanan sesi aman menggunakan cookie `httpOnly` dengan penandatanganan token JWT (**Jose**).
   - Middleware/Proxy (`proxy.ts`) untuk memproteksi halaman `/products` dan me-redirect pengguna yang belum login ke `/login`.
   - Layout login responsif: background video sinematik pada desktop dan fokus form ringkas pada mobile view.

2. **Katalog Produk Interaktif (`/products`)**:
   - **Dual View Mode**: Pilihan tampilan **Grid Card** atau **Data Table** interaktif yang ditenagai oleh **TanStack Table v8**.
   - **Pencarian Real-Time**: Pencarian instan berdasarkan nama produk atau deskripsi.
   - **Filter Kategori**: Filter cepat berdasarkan kategori produk (Puff Pods, Mod Systems, Saltnic Liquid, Freebase Liquid, Coils & Pods, Accessories).
   - **Filter Rentang Harga**: Dual slider interaktif dan input numerik sinkron untuk menyaring harga minimum & maksimum.
   - **Pengurutan (Sorting)**: Urutkan data berdasarkan Nama, Kategori, Harga, dan Stok (Ascending / Descending).
   - **Paginasi Fleksibel**: Pilihan jumlah data per halaman (8, 12, 24, 48) dengan ringkasan jumlah hasil.
   - **Mobile Drawer Filter**: Sidebar filter otomatis berubah menjadi drawer geser yang nyaman diakses pada perangkat mobile.

3. **Desain & Aksesibilitas**:
   - **Tema Terang & Gelap (Dark & Light Mode)**: Toggle tema instan dengan persistensi `localStorage` tanpa efek kedip (_zero FOUC_).
   - **Design Token Kustom**: Palet warna _Dark Chrome_ (`#141414`), aksen _Neon Lime Green_ (`#8dc63f` / `#a3d84a`), serta tipografi modern Barlow & Barlow Condensed.
   - **Modal Verifikasi Usia (21+)**: Peringatan formalitas usia saat pertama kali mengakses website dengan penyimpanan status di browser.
   - **Feedback & Notifikasi**: Toast notifikasi yang elegan menggunakan **Sonner**.

---

## 🛠 Tech Stack & Dependencies

### Core & Framework

| Package                   | Versi    | Deskripsi                                     |
| :------------------------ | :------- | :-------------------------------------------- |
| **Next.js**               | `16.3.8` | React framework dengan App Router & Turbopack |
| **React** & **React DOM** | `19.2.8` | Library UI berbasis komponen terbaru          |
| **TypeScript**            | `^5`     | Static type checking untuk keandalan kode     |

### Libraries & Dependencies Produksi

| Package                     | Versi     | Fungsi & Alasan Penggunaan                                 |
| :-------------------------- | :-------- | :--------------------------------------------------------- |
| **`@tanstack/react-table`** | `^8.21.3` | Manajemen data tabel (sorting, filtering, pagination)      |
| **`zod`**                   | `^4.6.5`  | Validasi skema tipe data dan formulir input                |
| **`jose`**                  | `^6.2.12` | Pembuatan dan verifikasi JWT yang ringan & kompatibel Edge |
| **`lucide-react`**          | `^1.52.0` | Kumpulan icon SVG yang konsisten dan modern                |
| **`sonner`**                | `^2.0.8`  | Sistem toast notification yang ringan dan elegan           |

### Development Dependencies

| Package                                        | Versi        | Fungsi                              |
| :--------------------------------------------- | :----------- | :---------------------------------- |
| **`tailwindcss`** & **`@tailwindcss/postcss`** | `^4`         | Utility-first CSS framework versi 4 |
| **`eslint`** & **`eslint-config-next`**        | `^9`         | Code linting standar Next.js        |
| **`@types/node`**, **`@types/react`**          | `^20`, `^19` | Definisi tipe TypeScript            |

---

## 💻 Prasyarat Sistem

Sebelum memulai, pastikan perangkat Anda telah terinstal:

- **Node.js**: Versi `18.18.0` atau yang lebih baru (disarankan Node.js `20.x` LTS).
- **Package Manager**: `npm`, `yarn`, `pnpm`, atau `bun`.

---

## 🚀 Instalasi & Menjalankan Proyek

1. **Clone repository ini:**

   ```bash
   git clone <URL_REPOSITORY_ANDA>
   cd "Frontend Technical Test"
   ```

2. **Install seluruh dependencies:**

   ```bash
   npm install
   ```

3. **Siapkan file environment:**
   Salin `.env.example` menjadi `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   _(Pada Windows Command Prompt:_ `copy .env.example .env.local`_)_

4. **Jalankan development server:**

   ```bash
   npm run dev
   ```

5. **Buka browser:**
   Akses [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

---

## 🔑 Konfigurasi Environment Variable

Buat atau edit file `.env.local` di root direktori proyek:

```env
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
```

> **Catatan:** Jika `JWT_SECRET` tidak didefinisikan, aplikasi memiliki fallback rahasia default untuk keperluan pengujian lokal, namun sangat disarankan untuk mengisinya dengan string acak yang aman.

---

## 👤 Akun Demo (Authentication)

Gunakan kredensial berikut untuk masuk ke dashboard produk:

- **Email**: `intern@example.com`
- **Password**: `intern123`

---

## 📁 Struktur Direktori

```text
├── app/
│   ├── (auth)/
│   │   └── login/             # Halaman login (video background desktop & mobile focus)
│   ├── api/
│   │   ├── auth/              # API Route untuk login, logout, dan status user (me)
│   │   └── products/          # API Route data katalog produk
│   ├── products/              # Halaman utama katalog produk
│   ├── globals.css            # Setup Tailwind v4, token warna, dan tema
│   └── layout.tsx             # Root layout, font provider, toaster & age modal
├── components/
│   ├── age-verification-modal.tsx # Modal verifikasi usia 21+
│   ├── app-header.tsx         # Header global, navigasi, profil, & logout
│   ├── login-form.tsx         # Form login dengan Zod validation
│   ├── theme-toggle.tsx       # Tombol pengubah tema Light/Dark
│   ├── products/
│   │   ├── filters-sidebar.tsx      # Sidebar filter kategori & slider harga
│   │   ├── product-card.tsx         # Komponen card grid produk
│   │   ├── product-list-table.tsx   # Tampilan tabel dengan TanStack Table
│   │   ├── products-pagination.tsx  # Kontrol paginasi data
│   │   ├── products-toolbar.tsx     # Bar pencarian, sortir, & switch view
│   │   └── products-view.tsx        # Container penggabung filter & tabel/grid
│   └── ui/
│       └── drawer.tsx         # Komponen drawer accessible untuk mobile
├── lib/
│   ├── auth.ts                # Helper autentikasi & pembacaan cookie sesi
│   ├── jwt.ts                 # Enkripsi & verifikasi token menggunakan jose
│   ├── products-data.ts       # Database mock produk & kategori
│   └── site.ts                # Konfigurasi konstanta situs (SITE_NAME)
├── proxy.ts                   # Middleware penanganan sesi & proteksi rute
├── public/                    # Aset statis (gambar produk, video login, favicon)
├── .env.example               # Template environment variable
└── package.json               # Konfigurasi dependencies & script NPM
```

---

## 📜 Skrip NPM yang Tersedia

Di dalam direktori proyek, Anda dapat menjalankan perintah berikut:

- `npm run dev`: Menjalankan server pengembangan lokal di `http://localhost:3000`.
- `npm run build`: Mengompilasi dan mengoptimasi aplikasi untuk kebutuhan produksi.
- `npm run start`: Menjalankan server aplikasi produksi setelah di-build.
- `npm run lint`: Memeriksa dan memvalidasi kualitas kode dengan ESLint.
