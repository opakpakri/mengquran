import React from 'react';

function SurahCard({ surah, onClick }) {
  const isMakkiyah = surah.revelation?.toLowerCase() === 'makkiyah';

  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex items-center justify-between overflow-hidden"
    >
      {/* Subtle highlight effect on hover */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

      <div className="flex items-center gap-4">
        {/* Surah Number Icon */}
        <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
          {/* Hexagonal/octagonal border outline */}
          <div className="absolute inset-0 border-2 border-slate-100 dark:border-slate-800/60 rotate-45 rounded-lg group-hover:border-emerald-500/20 transition-colors duration-300"></div>
          <span className="relative text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 transition-colors duration-300">
            {surah.number}
          </span>
        </div>

        {/* Names & Translation */}
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight group-hover:text-emerald-500 transition-colors duration-200">
            {surah.name_latin}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">
            {surah.translation}
          </p>
          
          {/* Metadata Badges */}
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[10px] px-2 py-0.5 font-semibold rounded-md ${
              isMakkiyah 
                ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400' 
                : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
            }`}>
              {surah.revelation}
            </span>
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
              {surah.number_of_ayahs} Ayat
            </span>
          </div>
        </div>
      </div>

      {/* Arabic Script & Play Button */}
      <div className="text-right flex flex-col items-end gap-1">
        <span className="text-xl font-bold font-arabic text-emerald-600 dark:text-emerald-400">
          {surah.name}
        </span>
      </div>
    </div>
  );
}

export default SurahCard;
