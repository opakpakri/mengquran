# 📖 Mengquran — Al-Quran Online Modern & Bersahaja

Mengquran adalah aplikasi web Al-Quran online modern yang dirancang untuk kenyamanan membaca, merenungi, dan mendengarkan Al-Quran. Dibangun dengan estetika minimalis, performa cepat, serta fitur pendukung ibadah yang interaktif.

---

## ✨ Fitur Utama

- **🟢 Murottal Player Pintar**: Pemutar audio per surah atau per ayat dengan efek *spotlight* (sorotan terang) pada ayat aktif, *dimming* (meredupkan) ayat pasif, animasi *soundwave*, dan *auto-scroll*.
- **🕌 Jadwal Sholat & Hitung Mundur**: Jadwal sholat harian terintegrasi API Kemenag RI, lengkap dengan fitur pencarian kota, penyimpanan preferensi lokal, serta hitung mundur waktu nyata (*real-time countdown*) ke waktu sholat berikutnya.
- **📚 Data Surah, Latin & Multi-Tafsir**: Memuat 114 surah lengkap dengan teks Arab, transliterasi Latin, terjemahan Indonesia, serta akses tafsir lengkap (Kemenag Ringkas/Lengkap, Jalalayn, Quraish Shihab).
- **⚙️ Kustomisasi Teks**: Slider interaktif untuk mengatur ukuran font Arab dan Latin/terjemahan secara terpisah (tersimpan otomatis di browser).
- **🔖 Bookmarks & Last Read**: Simpan ayat favorit dan tandai batas bacaan terakhir secara instan.
- **🔔 Notifikasi Interaktif**: Notifikasi *toast* interaktif selama 3 detik menggunakan **SweetAlert2** untuk setiap aktivitas bookmarking dan update batas bacaan.
- **🌓 Mode Gelap & Terang**: Tampilan premium dengan transisi warna halus yang menyesuaikan kenyamanan mata Anda.

---

## 🛠️ Teknologi Utama

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS v4 (Font Amiri, Plus Jakarta Sans, Inter)
- **Database Lokal**: Browser LocalStorage
- **API Resmi**: API Muslim v3 (myQuran) & e-Quran API

---

## 🚀 Cara Menjalankan Project

1. **Instal Dependensi**:
   ```bash
   npm install
   ```
2. **Jalankan Server Lokal**:
   ```bash
   npm run dev
   ```
3. **Build Produksi**:
   ```bash
   npm run build
   ```

---

Dibuat untuk mempermudah tadarus Al-Quran digital secara modern. 🕌✨
