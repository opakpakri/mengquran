# 📖 Mengquran — Al-Quran Online Modern & Bersahaja

Mengquran adalah aplikasi web Al-Quran online modern yang dirancang untuk memberikan kenyamanan membaca, merenungi, dan mendengarkan Al-Quran. Dibangun dengan estetika minimalis, performa cepat, serta fitur interaktif yang mendukung produktivitas ibadah harian Anda.

---

## ✨ Fitur Utama

- **🟢 Murottal Player Pintar dengan Spotlight & Dimming**
  - Pemutar audio berurutan (*sequential play*) per surah atau per ayat.
  - **Efek Spotlight & Dimming**: Ayat yang sedang berbunyi disorot terang lengkap dengan animasi *soundwave equalizer*, sementara ayat lainnya otomatis meredup agar Anda tetap fokus mendengarkan.
  - **Auto-Scroll**: Layar bergeser secara halus mengikuti ayat yang sedang dilantunkan.
- **📚 Data Surah, Latin & Multi-Tafsir Lengkap**
  - Menyajikan 114 surah lengkap dengan teks Arab, transliterasi Latin (dari equran.id), dan terjemahan bahasa Indonesia.
  - Paginasi otomatis yang gegas untuk surah-surah panjang seperti Al-Baqarah.
  - Akses tafsir ayat dari 4 sumber tepercaya: *Kemenag (Ringkas), Kemenag (Lengkap), Tafsir Jalalayn,* dan *Quraish Shihab*.
- **⚙️ Panel Pengaturan Ukuran Teks**
  - Sesuaikan ukuran teks Arab dan transliterasi/terjemahan secara terpisah menggunakan slider interaktif. Preferensi Anda otomatis tersimpan di peramban (*LocalStorage*).
- **🔖 Bookmark & Terakhir Dibaca (Last Read)**
  - Simpan ayat-ayat favorit ke halaman Bookmarks secara lokal.
  - Tandai ayat terakhir yang Anda baca dan kembali ke ayat tersebut secara instan dengan satu klik dari halaman utama.
- **🌓 Mode Gelap/Terang Premium**
  - Transisi warna yang halus antara mode terang yang segar dan mode gelap bernuansa emerald-slate yang teduh dan premium.
- **🔍 Mesin Pencarian Ayat Dinamis**
  - Cari ayat berdasarkan kata kunci terjemahan secara dinamis dilengkapi dengan pagination serta rujukan langsung ke surah terkait.
- **🕌 Jadwal Sholat Otomatis & Hitung Mundur**
  - Jadwal sholat harian terintegrasi dengan data resmi Kemenag RI.
  - Pencarian ID kota/kabupaten otomatis dengan fitur penyimpanan prefensi kota di peramban (*LocalStorage*).
  - **Hitung Mundur Sholat**: Menampilkan hitung mundur waktu nyata (*real-time countdown*) ke jadwal sholat berikutnya dengan efek sorotan visual card yang dinamis.

---

## 🛠️ Teknologi yang Digunakan

- **Framework & Core**: [React](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan font kustom (*Amiri* untuk Arab, *Plus Jakarta Sans* & *Inter* untuk UI).
- **Penyimpanan Lokal**: Browser LocalStorage untuk persistent state (Bookmarks, Ukuran Font, Last Read, dan Dark/Light Mode).
- **API Sumber Data**:
  - [API Muslim v3](https://api.myquran.com/v3/doc) oleh myQuran (Daftar Surah, Ayat, Murottal Audio, & Tafsir).
  - [e-Quran API](https://equran.id/) (Latin Transliterasi).

---

## 🚀 Cara Menjalankan Project Secara Lokal

### Prasyarat
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) di perangkat Anda.

### Langkah-langkah
1. **Clone repository ini** (atau unduh kodenya)
2. **Masuk ke direktori project**
3. **Instal dependensi**
   ```bash
   npm install
   ```
4. **Jalankan server pengembangan lokal**
   ```bash
   npm run dev
   ```
   *Buka `http://localhost:5173` di browser Anda.*
5. **Membuat build produksi**
   ```bash
   npm run build
   ```

---

## 📄 Lisensi & Kontribusi

Aplikasi ini dikembangkan untuk kepentingan umum dan edukasi. Kontribusi berupa saran perbaikan desain maupun fungsionalitas sangat diapresiasi.

Dibuat dengan penuh rasa takzim untuk mempermudah tadarus Al-Quran digital. 🕌✨
