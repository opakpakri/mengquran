import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SurahCard from './components/SurahCard';
import SurahDetail from './components/SurahDetail';
import SearchPage from './components/SearchPage';
import BookmarksPage from './components/BookmarksPage';
import SholatPage from './components/SholatPage';
import Footer from './components/Footer';
import Swal from 'sweetalert2';


function App() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState('surah'); // 'surah', 'detail', 'search', 'bookmarks'
  const [selectedSurahNumber, setSelectedSurahNumber] = useState(null);
  const [selectedAyahNumber, setSelectedAyahNumber] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
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

  // Scroll Listener for Scroll to Top Button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      document.title = 'Mengquran | Digital Modern Al-Quran';
    } else if (activeTab === 'detail' && selectedSurahNumber) {
      const currentSurah = surahs.find(s => s.number === selectedSurahNumber);
      if (currentSurah) {
        document.title = `Surah ${currentSurah.name_latin} | Mengquran`;
      } else {
        document.title = 'Membaca Surah | Mengquran';
      }
    } else if (activeTab === 'search') {
      document.title = 'Cari Ayat Al-Quran | Mengquran';
    } else if (activeTab === 'bookmarks') {
      document.title = 'Ayat Tersimpan | Mengquran';
    } else if (activeTab === 'sholat') {
      document.title = 'Jadwal Sholat | Mengquran';
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
  const toggleBookmark = (surahNumber, surahNameLatin, ayahNumber, arab = null, translation = null, latin = null) => {
    const isAlreadyBookmarked = bookmarks.some(b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
    
    if (isAlreadyBookmarked) {
      // Remove bookmark
      setBookmarks(prev => prev.filter(b => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)));
      Swal.fire({
        title: 'Bookmark Dihapus',
        text: `Ayat ${surahNumber}:${ayahNumber} telah dihapus dari bookmarks.`,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: darkMode ? '#0f172a' : '#ffffff',
        color: darkMode ? '#f8fafc' : '#334155',
        iconColor: '#10b981',
        customClass: {
          popup: 'rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-md font-sans'
        }
      });
    } else {
      // Add bookmark
      setBookmarks(prev => [
        ...prev,
        {
          surahNumber,
          surahNameLatin,
          ayahNumber,
          arab,
          translation,
          latin
        }
      ]);
      Swal.fire({
        title: 'Bookmark Ditambahkan',
        text: `Ayat ${surahNumber}:${ayahNumber} disimpan ke bookmarks.`,
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: darkMode ? '#0f172a' : '#ffffff',
        color: darkMode ? '#f8fafc' : '#334155',
        iconColor: '#10b981',
        customClass: {
          popup: 'rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-md font-sans'
        }
      });
    }
  };

  // Update Last Read
  const updateLastRead = (surahNumber, surahNameLatin, ayahNumber) => {
    setLastRead({
      surahNumber,
      surahNameLatin,
      ayahNumber
    });
    Swal.fire({
      title: 'Terakhir Dibaca Diperbarui',
      text: `Surah ${surahNameLatin} ayat ${ayahNumber} ditandai sebagai terakhir dibaca.`,
      icon: 'info',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: darkMode ? '#0f172a' : '#ffffff',
      color: darkMode ? '#f8fafc' : '#334155',
      iconColor: '#6366f1',
      customClass: {
        popup: 'rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-md font-sans'
      }
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

        {activeTab === 'sholat' && (
          <SholatPage />
        )}
      </main>

      {/* Footer component */}
      <Footer />

      {/* Scroll to Top Floating Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 p-3.5 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/20 dark:shadow-slate-900/40 hover:-translate-y-0.5 cursor-pointer transition-all duration-300 animate-fade-in flex items-center justify-center"
          aria-label="Scroll to Top"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default App;
