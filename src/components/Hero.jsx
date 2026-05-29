import React, { useState, useEffect } from 'react';

function Hero({ searchSurah, setSearchSurah, onSelectSurah, lastRead }) {
  const [randomAyah, setRandomAyah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRandomAyah = async () => {
    setRefreshing(true);
    try {
      if (audio) {
        audio.pause();
        setAudioPlaying(false);
      }
      const res = await fetch('https://api.myquran.com/v3/quran/random');
      const data = await res.json();
      if (data.status && data.data) {
        const ayah = data.data;
        let latinText = '';
        try {
          const equranRes = await fetch(`https://equran.id/api/v2/surat/${ayah.surah_number}`);
          const equranData = await equranRes.json();
          if (equranData.code === 200 && equranData.data && equranData.data.ayat) {
            const match = equranData.data.ayat.find(a => a.nomorAyat === ayah.ayah_number);
            if (match) {
              latinText = match.teksLatin;
            }
          }
        } catch (e) {
          console.error("Gagal mengambil latin acak:", e);
        }
        setRandomAyah({
          ...ayah,
          latin: latinText
        });
      }
    } catch (err) {
      console.error("Gagal memuat ayat acak:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRandomAyah();
    return () => {
      if (audio) audio.pause();
    };
  }, []);

  const handlePlayAudio = () => {
    if (!randomAyah || !randomAyah.audio_url) return;

    if (audioPlaying && audio) {
      audio.pause();
      setAudioPlaying(false);
    } else {
      let activeAudio = audio;
      if (!activeAudio) {
        activeAudio = new Audio(randomAyah.audio_url);
        setAudio(activeAudio);
      }
      activeAudio.play();
      setAudioPlaying(true);
      activeAudio.onended = () => {
        setAudioPlaying(false);
      };
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 animate-fade-in">
      {/* Banner Utama */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white p-6 sm:p-10 shadow-lg shadow-emerald-500/10 mb-8 border border-emerald-500/20">
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10 pointer-events-none">
          <svg className="w-72 h-72" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Mari Membaca & Mentadabburi
          </h1>
          <p className="text-emerald-100 text-base sm:text-lg mb-6 max-w-md font-light leading-relaxed">
            Membawa keindahan dan kedamaian Al-Quran langsung ke dalam genggaman Anda.
          </p>

          {/* Kolom Pencarian */}
          <div className="relative max-w-md flex items-center shadow-md bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 px-4 py-2 focus-within:ring-2 focus-within:ring-white/40 transition-all duration-200">
            <svg className="w-5 h-5 text-emerald-100 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="surah-search-input"
              type="text"
              placeholder="Cari surah (contoh: Al-Kahfi)..."
              value={searchSurah}
              onChange={(e) => setSearchSurah(e.target.value)}
              className="bg-transparent text-white placeholder-emerald-200/70 border-none outline-none w-full text-base"
            />
            {searchSurah && (
              <button
                onClick={() => setSearchSurah('')}
                className="text-emerald-100 hover:text-white p-1 rounded-full cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Terakhir Dibaca Banner */}
      {lastRead && (
        <div className="flex items-center justify-between p-4 sm:p-5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-3xl mb-8 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h4 className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">Terakhir Dibaca</h4>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                Surah {lastRead.surahNameLatin} : Ayat {lastRead.ayahNumber}
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectSurah(lastRead.surahNumber, lastRead.ayahNumber)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <span>Lanjutkan</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      )}

      {/* Ayat Hari Ini (Verse of the Day) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Ayat Pilihan Hari Ini
            </h2>
          </div>
          <button
            id="refresh-ayah-btn"
            onClick={fetchRandomAyah}
            disabled={refreshing}
            className={`p-2 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors duration-200 cursor-pointer ${
              refreshing ? 'animate-spin' : ''
            }`}
            title="Muat ayat baru"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl w-3/4 ml-auto"></div>
            <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full"></div>
            <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-1/2"></div>
          </div>
        ) : randomAyah ? (
          <div className="space-y-6">
            {/* Teks Arab */}
            <div className="text-right">
              <p className="arabic-text text-2xl sm:text-3xl text-slate-800 dark:text-slate-100 font-arabic leading-loose tracking-wide">
                {randomAyah.arab}
              </p>
            </div>

            {/* Latin Transliteration */}
            {randomAyah.latin && (
              <p className="text-emerald-600 dark:text-emerald-400 text-sm sm:text-base leading-relaxed font-light italic">
                {randomAyah.latin}
              </p>
            )}

            {/* Terjemahan */}
            <div className="space-y-2">
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-light italic">
                "{randomAyah.translation}"
              </p>

              {/* Referensi & Aksi */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  onClick={() => {
                    if (onSelectSurah) {
                      // Format referensi: surah_number, scroll to ayah_number
                      onSelectSurah(randomAyah.surah_number, randomAyah.ayah_number);
                    }
                  }}
                  className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium text-sm transition-colors duration-150 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Q.S. Surah {randomAyah.surah_number} : Ayat {randomAyah.ayah_number}</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePlayAudio}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      audioPlaying
                        ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/10'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/10'
                    }`}
                  >
                    {audioPlaying ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                        </svg>
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span>Dengarkan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-sm">Gagal memuat ayat acak.</p>
        )}
      </div>
    </div>
  );
}

export default Hero;
