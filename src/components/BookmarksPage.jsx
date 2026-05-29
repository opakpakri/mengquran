import React from 'react';

function BookmarksPage({ bookmarks, toggleBookmark, onSelectSurah, setActiveTab }) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
      {/* Page Title & Context */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Ayat Tersimpan (Bookmarks)
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-light mt-1">
          Daftar ayat-ayat pilihan Anda yang telah disimpan untuk dibaca kembali.
        </p>
      </div>

      {bookmarks.length > 0 ? (
        <div className="space-y-6">
          {bookmarks.map((bookmark) => (
            <div
              key={`${bookmark.surahNumber}-${bookmark.ayahNumber}`}
              className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 hover:border-emerald-500/20 rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-sm hover:shadow-md relative overflow-hidden"
            >
              {/* Top row with details & actions */}
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-50 dark:border-slate-800/50">
                <button
                  onClick={() => onSelectSurah(bookmark.surahNumber, bookmark.ayahNumber)}
                  className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>{bookmark.surahNameLatin} • Ayat {bookmark.ayahNumber}</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>

                {/* Remove bookmark action */}
                <button
                  onClick={() => toggleBookmark(bookmark.surahNumber, bookmark.surahNameLatin, bookmark.ayahNumber)}
                  className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                  title="Hapus dari tersimpan"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Clicking the text details goes to the Surah page */}
              <div
                onClick={() => onSelectSurah(bookmark.surahNumber, bookmark.ayahNumber)}
                className="cursor-pointer"
              >
                {/* Arabic script */}
                {bookmark.arab && (
                  <div className="text-right mb-4">
                    <p className="arabic-text text-xl sm:text-2xl text-slate-800 dark:text-slate-100 font-arabic leading-loose select-none">
                      {bookmark.arab}
                    </p>
                  </div>
                )}

                {/* Latin Transliteration */}
                {bookmark.latin && (
                  <p className="text-emerald-600 dark:text-emerald-400 text-sm sm:text-base leading-relaxed font-light mb-3 select-none italic">
                    {bookmark.latin}
                  </p>
                )}

                {/* Translation */}
                {bookmark.translation && (
                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                    {bookmark.translation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow-sm">
          <svg className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada ayat yang disimpan.</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 mb-6">Tandai ayat favorit Anda saat membaca Surah.</p>
          <button
            onClick={() => setActiveTab('surah')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer shadow-sm shadow-emerald-500/10"
          >
            Mulai Membaca Surah
          </button>
        </div>
      )}
    </div>
  );
}

export default BookmarksPage;
