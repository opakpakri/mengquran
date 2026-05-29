import React, { useState, useEffect, useRef } from 'react';

function SurahDetail({ surahNumber, initialAyah, onBack, bookmarks, toggleBookmark, onSelectSurah, lastRead, updateLastRead }) {
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Tafsir expanded state: { [ayahNumber]: boolean }
  const [expandedTafsir, setExpandedTafsir] = useState({});
  // Tafsir active tab state: { [ayahNumber]: 'kemenag_short' | 'kemenag_long' | 'jalalayn' | 'quraish' }
  const [tafsirTabs, setTafsirTabs] = useState({});
  
  // Audio state
  const [playingAudioId, setPlayingAudioId] = useState(null); // 'surah' or 'ayah-{number}'
  const audioRef = useRef(null);

  // Text Font Size States
  const [arabicSize, setArabicSize] = useState(() => {
    try {
      const saved = localStorage.getItem('mengquran_arabic_size');
      return saved ? parseFloat(saved) : 2.25;
    } catch {
      return 2.25;
    }
  });

  const [translationSize, setTranslationSize] = useState(() => {
    try {
      const saved = localStorage.getItem('mengquran_translation_size');
      return saved ? parseFloat(saved) : 1;
    } catch {
      return 1;
    }
  });

  // Sync font sizes to localStorage
  useEffect(() => {
    localStorage.setItem('mengquran_arabic_size', arabicSize);
  }, [arabicSize]);

  useEffect(() => {
    localStorage.setItem('mengquran_translation_size', translationSize);
  }, [translationSize]);

  // Fetch Surah Details
  useEffect(() => {
    const fetchSurahDetail = async () => {
      setLoading(true);
      // Clean up previous audio if any
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingAudioId(null);
      }
      try {
        const res = await fetch(`https://api.myquran.com/v3/quran/${surahNumber}`);
        const data = await res.json();
        
        let equranAyat = [];
        try {
          const equranRes = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
          const equranData = await equranRes.json();
          if (equranData.code === 200 && equranData.data && equranData.data.ayat) {
            equranAyat = equranData.data.ayat;
          }
        } catch (e) {
          console.error("Gagal mengambil latin dari equran.id:", e);
        }

        if (data.status && data.data) {
          const enrichedAyahs = data.data.ayahs.map(ayah => {
            const match = equranAyat.find(a => a.nomorAyat === ayah.ayah_number);
            return {
              ...ayah,
              latin: match ? match.teksLatin : ''
            };
          });

          setSurah({
            ...data.data,
            ayahs: enrichedAyahs
          });
          setExpandedTafsir({});
          setTafsirTabs({});
        }
      } catch (err) {
        console.error("Gagal memuat detail surah:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurahDetail();
  }, [surahNumber]);

  // Handle Scroll to Initial Ayah
  useEffect(() => {
    if (!loading && surah && initialAyah) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`ayah-${initialAyah}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add highlight class
          element.classList.add('ring-2', 'ring-emerald-500', 'bg-emerald-50/20', 'dark:bg-emerald-950/10');
          
          // Remove highlight class after 3 seconds
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-emerald-500', 'bg-emerald-50/20', 'dark:bg-emerald-950/10');
          }, 3000);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, surah, initialAyah]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Handle Play Audio (Full Surah or Individual Ayah)
  const handlePlayAudio = (url, id) => {
    if (!url) return;

    if (playingAudioId === id && audioRef.current) {
      audioRef.current.pause();
      setPlayingAudioId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(url);
      setPlayingAudioId(id);
      audioRef.current.play().catch(e => console.error("Audio playback error:", e));
      audioRef.current.onended = () => {
        // If playing individual ayah, we can stop. If full surah, stop.
        setPlayingAudioId(null);
      };
    }
  };

  const toggleTafsir = (ayahNum) => {
    setExpandedTafsir(prev => ({
      ...prev,
      [ayahNum]: !prev[ayahNum]
    }));
    
    // Set default tab if not set
    if (!tafsirTabs[ayahNum]) {
      setTafsirTabs(prev => ({
        ...prev,
        [ayahNum]: 'kemenag_short'
      }));
    }
  };

  const changeTafsirTab = (ayahNum, tab) => {
    setTafsirTabs(prev => ({
      ...prev,
      [ayahNum]: tab
    }));
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium">Memuat Ayat-Ayat Al-Quran...</p>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-rose-500 font-medium">Surah tidak ditemukan.</p>
        <button onClick={onBack} className="mt-4 bg-emerald-500 text-white px-6 py-2 rounded-xl">Kembali</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
      {/* Tombol Kembali & Header navigasi */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium text-sm transition-colors duration-150 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Kembali ke Daftar Surah</span>
        </button>
        
        {/* Next/Prev buttons in header */}
        <div className="flex items-center gap-2">
          {surah.number > 1 && (
            <button
              onClick={() => onSelectSurah(surah.number - 1)}
              className="p-2 rounded-xl border border-slate-100 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
              title="Surah Sebelumnya"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
            {surah.number} / 114
          </span>
          {surah.number < 114 && (
            <button
              onClick={() => onSelectSurah(surah.number + 1)}
              className="p-2 rounded-xl border border-slate-100 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
              title="Surah Berikutnya"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Detail Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white p-6 sm:p-8 shadow-lg shadow-emerald-500/10 mb-8 border border-emerald-500/20 text-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>
        
        <h1 className="text-3xl font-extrabold tracking-tight mb-1">{surah.name_latin}</h1>
        <p className="text-2xl font-bold font-arabic mb-3 text-emerald-100">{surah.name}</p>
        
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-emerald-100/90 mb-4 flex-wrap">
          <span className="bg-white/10 px-3 py-1 rounded-full">{surah.revelation}</span>
          <span>•</span>
          <span className="bg-white/10 px-3 py-1 rounded-full">{surah.number_of_ayahs} Ayat</span>
          <span>•</span>
          <span className="bg-white/10 px-3 py-1 rounded-full">Arti: {surah.translation}</span>
        </div>

        {surah.description && (
          <p className="text-emerald-100/90 text-sm font-light max-w-2xl mx-auto leading-relaxed border-t border-white/10 pt-4 mt-2">
            {surah.description.replace(/<\/?[^>]+(>|$)/g, "")}
          </p>
        )}

        {/* Play Full Surah Audio Button */}
        {surah.audio_url && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePlayAudio(surah.audio_url, 'surah')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                playingAudioId === 'surah'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-white text-emerald-800 hover:bg-emerald-50 shadow-md'
              }`}
            >
              {playingAudioId === 'surah' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  <span>Menghentikan Murottal Surah</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 fill-emerald-800" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Putar Murottal Surah</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Ukuran Teks</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 w-full sm:w-auto justify-end">
          {/* Slider Arab */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">Arab:</span>
            <input
              type="range"
              min="1.75"
              max="3.5"
              step="0.1"
              value={arabicSize}
              onChange={(e) => setArabicSize(parseFloat(e.target.value))}
              className="accent-emerald-500 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer w-28"
            />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 w-8 text-right">{Math.round((arabicSize / 2.25) * 100)}%</span>
          </div>

          {/* Slider Latin & Terjemahan */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">Latin & Arti:</span>
            <input
              type="range"
              min="0.8"
              max="1.6"
              step="0.05"
              value={translationSize}
              onChange={(e) => setTranslationSize(parseFloat(e.target.value))}
              className="accent-emerald-500 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer w-28"
            />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 w-8 text-right">{Math.round(translationSize * 100)}%</span>
          </div>

          {/* Reset button */}
          <button
            onClick={() => {
              setArabicSize(2.25);
              setTranslationSize(1);
            }}
            className="text-[10px] font-bold text-slate-400 hover:text-emerald-500 px-2.5 py-1 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/20 rounded-lg cursor-pointer transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Surah Bismillah Divider (except Al-Fatihah (1) and At-Taubah (9)) */}
      {surah.number !== 1 && surah.number !== 9 && (
        <div className="text-center py-6 mb-8 text-slate-700 dark:text-slate-300 font-arabic text-2xl tracking-wide select-none">
          بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
        </div>
      )}

      {/* Verses List */}
      <div className="space-y-6">
        {surah.ayahs && surah.ayahs.map((ayah) => {
          const isBookmarked = bookmarks.some(b => b.surahNumber === surah.number && b.ayahNumber === ayah.ayah_number);
          const isLastRead = lastRead?.surahNumber === surah.number && lastRead?.ayahNumber === ayah.ayah_number;
          const isTafsirOpen = expandedTafsir[ayah.ayah_number];
          const activeTafsirTab = tafsirTabs[ayah.ayah_number] || 'kemenag_short';

          return (
            <div
              key={ayah.ayah_number}
              id={`ayah-${ayah.ayah_number}`}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {/* Header Ayat Panel */}
              <div className="flex items-center justify-between gap-4 mb-5 border-b border-slate-50 dark:border-slate-800/50 pb-3 flex-wrap">
                <span className="text-xs font-bold px-3 py-1 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 rounded-lg">
                  {surah.number} : {ayah.ayah_number}
                </span>

                <div className="flex items-center gap-2">
                  {/* Terakhir Baca Button */}
                  <button
                    onClick={() => updateLastRead(surah.number, surah.name_latin, ayah.ayah_number)}
                    className={`p-2 rounded-xl transition-all duration-150 cursor-pointer ${
                      isLastRead
                        ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20'
                        : 'text-slate-400 hover:text-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                    title={isLastRead ? 'Ayat ini ditandai terakhir dibaca' : 'Tandai terakhir dibaca'}
                  >
                    <svg className="w-5 h-5" fill={isLastRead ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                  </button>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleBookmark(surah.number, surah.name_latin, ayah.ayah_number, ayah.arab, ayah.translation, ayah.latin)}
                    className={`p-2 rounded-xl transition-all duration-150 cursor-pointer ${
                      isBookmarked
                        ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                        : 'text-slate-400 hover:text-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                    title={isBookmarked ? 'Hapus bookmark' : 'Bookmark ayat ini'}
                  >
                    <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>

                  {/* Play Audio Button */}
                  <button
                    onClick={() => handlePlayAudio(ayah.audio_url, `ayah-${ayah.ayah_number}`)}
                    className={`p-2 rounded-xl transition-all duration-150 cursor-pointer ${
                      playingAudioId === `ayah-${ayah.ayah_number}`
                        ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/20'
                        : 'text-slate-400 hover:text-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                    title="Putar audio ayat"
                  >
                    {playingAudioId === `ayah-${ayah.ayah_number}` ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Arabic Script */}
              <div className="text-right mb-4">
                <p 
                  className="arabic-text text-slate-800 dark:text-slate-100 font-arabic tracking-wide select-all"
                  style={{ fontSize: `${arabicSize}rem`, lineHeight: `${arabicSize * 1.3}rem` }}
                >
                  {ayah.arab}
                </p>
              </div>

              {/* Latin Transliteration */}
              {ayah.latin && (
                <p 
                  className="text-emerald-600 dark:text-emerald-400 leading-relaxed font-light mb-3 select-all italic"
                  style={{ fontSize: `${translationSize}rem` }}
                >
                  {ayah.latin}
                </p>
              )}

              {/* Translation */}
              <p 
                className="text-slate-700 dark:text-slate-300 leading-relaxed font-light mb-4"
                style={{ fontSize: `${translationSize}rem` }}
              >
                {ayah.translation}
              </p>

              {/* Tafsir Collapse Trigger */}
              <div className="mt-4">
                <button
                  onClick={() => toggleTafsir(ayah.ayah_number)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                >
                  <span>{isTafsirOpen ? 'Tutup Tafsir' : 'Lihat Tafsir Ayat'}</span>
                  <svg className={`w-3 h-3 transform transition-transform duration-200 ${isTafsirOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded Tafsir Panel */}
                {isTafsirOpen && (
                  <div className="mt-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800/40 animate-slide-up">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 dark:border-slate-700 pb-2 mb-4 overflow-x-auto gap-2 scrollbar-none">
                      <button
                        onClick={() => changeTafsirTab(ayah.ayah_number, 'kemenag_short')}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                          activeTafsirTab === 'kemenag_short'
                            ? 'bg-emerald-500 text-white'
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        Kemenag (Ringkas)
                      </button>
                      <button
                        onClick={() => changeTafsirTab(ayah.ayah_number, 'kemenag_long')}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                          activeTafsirTab === 'kemenag_long'
                            ? 'bg-emerald-500 text-white'
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        Kemenag (Lengkap)
                      </button>
                      <button
                        onClick={() => changeTafsirTab(ayah.ayah_number, 'jalalayn')}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                          activeTafsirTab === 'jalalayn'
                            ? 'bg-emerald-500 text-white'
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        Tafsir Jalalayn
                      </button>
                      <button
                        onClick={() => changeTafsirTab(ayah.ayah_number, 'quraish')}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                          activeTafsirTab === 'quraish'
                            ? 'bg-emerald-500 text-white'
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        Quraish Shihab
                      </button>
                    </div>

                    {/* Tab Contents */}
                    <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-light">
                      {activeTafsirTab === 'kemenag_short' && (
                        <p className="whitespace-pre-wrap">{ayah.tafsir?.kemenag?.short || 'Tafsir tidak tersedia.'}</p>
                      )}
                      {activeTafsirTab === 'kemenag_long' && (
                        <p className="whitespace-pre-wrap">{ayah.tafsir?.kemenag?.long || 'Tafsir tidak tersedia.'}</p>
                      )}
                      {activeTafsirTab === 'jalalayn' && (
                        <p className="whitespace-pre-wrap">{ayah.tafsir?.jalalayn || 'Tafsir tidak tersedia.'}</p>
                      )}
                      {activeTafsirTab === 'quraish' && (
                        <p className="whitespace-pre-wrap">{ayah.tafsir?.quraish || 'Tafsir tidak tersedia.'}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigasi Surah di bagian Bawah Halaman */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-100 dark:border-slate-800/80">
        {surah.number > 1 ? (
          <button
            onClick={() => onSelectSurah(surah.number - 1)}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-sm cursor-pointer transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Surah Sebelumnya</span>
          </button>
        ) : (
          <div></div>
        )}

        {surah.number < 114 ? (
          <button
            onClick={() => onSelectSurah(surah.number + 1)}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-sm cursor-pointer transition-colors"
          >
            <span>Surah Berikutnya</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default SurahDetail;
