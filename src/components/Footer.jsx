import React from 'react';

function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 py-8 text-center text-xs text-slate-400 dark:text-slate-500">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center justify-center gap-3">
        <div>
          <p className="font-semibold text-slate-500 dark:text-slate-400">Mengqur'an © {new Date().getFullYear()}</p>
          <p className="font-light mt-0.5">Membaca Al-Quran online secara modern & bersahaja.</p>
        </div>
        <div className="flex items-center justify-center gap-3 font-medium">
          <a
            href="https://opakptw.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <span className="text-xs">opakptw</span>
          </a>
          <span className="text-slate-300 dark:text-slate-700 select-none text-[10px]">•</span>
          <a
            href="https://api.myquran.com/v3/doc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-md text-emerald-600 dark:text-emerald-400 font-semibold transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-900/35 cursor-pointer"
          >
            API Muslim v3
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
