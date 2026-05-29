import React, { useState } from 'react';

function SearchPage({ onSelectSurah }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async (e, pageNum = 1) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    setCurrentPage(pageNum);

    try {
      const res = await fetch('https://api.myquran.com/v3/quran/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          keyword: query,
          limit: 20,
          page: pageNum
        })
      });
      const data = await res.json();
      if (data.status && data.data) {
        setResults(data.data);
        setPagination(data.pagination);
      } else {
        setResults([]);
        setPagination(null);
      }
    } catch (err) {
      console.error("Gagal melakukan pencarian:", err);
      setResults([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || (pagination && newPage > Math.ceil(pagination.total / pagination.limit))) return;
    handleSearch(null, newPage);
  };

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.limit) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
      {/* Page Title & Context */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Cari Ayat Al-Quran
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-light mt-1">
          Cari ayat Al-Quran menggunakan terjemahan bahasa Indonesia (contoh: "sabar", "syukur", "shalat").
        </p>
      </div>

      {/* Search Bar Form */}
      <form onSubmit={(e) => handleSearch(e, 1)} className="mb-8">
        <div className="flex gap-2 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus-within:border-emerald-500/50 transition-colors duration-200">
          <input
            id="quran-search-input"
            type="text"
            placeholder="Ketik kata kunci pencarian..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow bg-transparent border-none outline-none text-slate-800 dark:text-white px-4 py-3 text-base placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors duration-150 inline-flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
            <span className="hidden sm:inline">Cari</span>
          </button>
        </div>
      </form>

      {/* Search Results */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 animate-pulse space-y-4">
              <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-lg w-1/4"></div>
              <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg w-3/4 ml-auto"></div>
              <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-lg w-full"></div>
            </div>
          ))}
        </div>
      ) : searched ? (
        results.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 font-light mb-4">
              <span>Menampilkan {results.length} hasil dari total {pagination?.total || results.length} ayat</span>
              {totalPages > 1 && <span>Halaman {currentPage} dari {totalPages}</span>}
            </div>

            <div className="space-y-6">
              {results.map((result) => (
                <div
                  key={result.id}
                  onClick={() => onSelectSurah(result.surah_number, result.ayah_number)}
                  className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 hover:border-emerald-500/20 rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-50 dark:border-slate-800/50">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 transition-colors">
                      {result.surah?.name_latin} • Ayat {result.ayah_number}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      Q.S. {result.surah_number}:{result.ayah_number}
                    </span>
                  </div>

                  {/* Arabic script */}
                  <div className="text-right mb-4">
                    <p className="arabic-text text-xl sm:text-2xl text-slate-800 dark:text-slate-100 font-arabic leading-loose select-none">
                      {result.arab}
                    </p>
                  </div>

                  {/* Translation */}
                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-light select-none">
                    {result.translation}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/60 disabled:opacity-50 transition-all cursor-pointer"
                >
                  Sebelumnya
                </button>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850/60 disabled:opacity-50 transition-all cursor-pointer"
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow-sm">
            <svg className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Ayat dengan kata kunci "{query}" tidak ditemukan.</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Coba gunakan kata kunci lain seperti "surga", "hidayah", atau "shalat".</p>
          </div>
        )
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow-sm">
          <svg className="w-12 h-12 text-emerald-500/20 dark:text-emerald-500/10 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Cari ayat untuk mulai menjelajah.</p>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
