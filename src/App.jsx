import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SurahCard from './components/SurahCard';
import SurahDetail from './components/SurahDetail';
import SearchPage from './components/SearchPage';
import BookmarksPage from './components/BookmarksPage';
import Footer from './components/Footer';


function App() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState('surah'); // 'surah', 'detail', 'search', 'bookmarks'
  const [selectedSurahNumber, setSelectedSurahNumber] = useState(null);
  const [selectedAyahNumber, setSelectedAyahNumber] = useState(null);
  
  // Data States
  const [surahs, setSurahs] = useState([]);
  const [loadingSurahs, setLoadingSurahs] = useState(true);
  const [searchSurah, setSearchSurah] = useState('');
  
  // Settings & Storage States
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('mengquran_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastRead, setLastRead] = useState(() => {
    try {
      const saved = localStorage.getItem('mengquran_last_read');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('mengquran_dark_mode');
      if (saved !== null) {
        return saved === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Dark Mode Sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('mengquran_dark_mode', darkMode);
  }, [darkMode]);

  // Bookmarks Sync
  useEffect(() => {
    localStorage.setItem('mengquran_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Last Read Sync
  useEffect(() => {
    if (lastRead) {
      localStorage.setItem('mengquran_last_read', JSON.stringify(lastRead));
    } else {
      localStorage.removeItem('mengquran_last_read');
    }
  }, [lastRead]);

  // Fetch Surah List
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const res = await fetch('https://api.myquran.com/v3/quran');
        const data = await res.json();
        if (data.status && data.data) {
          setSurahs(data.data);
        }
      } catch (err) {
        console.error("Gagal mengambil daftar surah:", err);
      } finally {
        setLoadingSurahs(false);
      }
    };
    fetchSurahs();
  }, []);

  // Dynamic Page Title for SEO & UX
  useEffect(() => {
    if (activeTab === 'surah') {
      document.title = 'Mengqur\'an - Al-Quran Online Modern';
    } else if (activeTab === 'detail' && selectedSurahNumber) {
      const currentSurah = surahs.find(s => s.number === selectedSurahNumber);
      if (currentSurah) {
        document.title = `Surah ${currentSurah.name_latin} | Mengqur'an`;
      } else {
        document.title = 'Membaca Surah | Mengqur\'an';
      }
    } else if (activeTab === 'search') {
      document.title = 'Cari Ayat Al-Quran | Mengqur\'an';
    } else if (activeTab === 'bookmarks') {
      document.title = 'Ayat Tersimpan | Mengqur\'an';
    }
  }, [activeTab, selectedSurahNumber, surahs]);

  // Handle Surah/Ayah Routing Action
  const handleSelectSurah = (surahNum, ayahNum = null) => {
    setSelectedSurahNumber(surahNum);
    setSelectedAyahNumber(ayahNum);
    setActiveTab('detail');
    // Scroll window to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToHome = () => {
    setActiveTab('surah');
    setSelectedSurahNumber(null);
    setSelectedAyahNumber(null);
  };

  // Toggle Bookmark
  const toggleBookmark = (surahNumber, surahNameLatin, ayahNumber, arab = null, translation = null) => {
    setBookmarks(prev => {
      const index = prev.findIndex(b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
      if (index > -1) {
        // Remove bookmark
        return prev.filter((_, i) => i !== index);
      } else {
        // Add bookmark
        return [
          ...prev,
          {
            surahNumber,
            surahNameLatin,
            ayahNumber,
            arab,
            translation
          }
        ];
      }
    });
  };

  // Update Last Read
  const updateLastRead = (surahNumber, surahNameLatin, ayahNumber) => {
    setLastRead({
      surahNumber,
      surahNameLatin,
      ayahNumber
    });
  };

  // Filter Surah List
  const filteredSurahs = surahs.filter(surah =>
    surah.name_latin.toLowerCase().includes(searchSurah.toLowerCase()) ||
    surah.translation.toLowerCase().includes(searchSurah.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-950 dark:selection:text-emerald-300">
      {/* Header / Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-grow pb-16">
        {activeTab === 'surah' && (
          <>
            <Hero
              searchSurah={searchSurah}
              setSearchSurah={setSearchSurah}
              onSelectSurah={handleSelectSurah}
              lastRead={lastRead}
            />
            
            {/* Surah List Grid */}
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
              {loadingSurahs ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 h-24 animate-pulse flex items-center justify-between">
                      <div className="flex items-center gap-4 w-2/3">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                        <div className="space-y-2 w-full">
                          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4"></div>
                          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
                    </div>
                  ))}
                </div>
              ) : filteredSurahs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                  {filteredSurahs.map((surah) => (
                    <SurahCard
                      key={surah.number}
                      surah={surah}
                      onClick={() => handleSelectSurah(surah.number)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow-sm">
                  <svg className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Surah "{searchSurah}" tidak ditemukan.</p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Gunakan pencarian Latin biasa (contoh: "Al-Mulk" atau "Kerajaan").</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'detail' && (
          <SurahDetail
            surahNumber={selectedSurahNumber}
            initialAyah={selectedAyahNumber}
            onBack={handleBackToHome}
            bookmarks={bookmarks}
            toggleBookmark={toggleBookmark}
            onSelectSurah={handleSelectSurah}
            lastRead={lastRead}
            updateLastRead={updateLastRead}
          />
        )}

        {activeTab === 'search' && (
          <SearchPage
            onSelectSurah={handleSelectSurah}
          />
        )}

        {activeTab === 'bookmarks' && (
          <BookmarksPage
            bookmarks={bookmarks}
            toggleBookmark={toggleBookmark}
            onSelectSurah={handleSelectSurah}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Footer component */}
      <Footer />
    </div>
  );
}

export default App;
