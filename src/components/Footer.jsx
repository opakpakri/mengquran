import React from 'react';

function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 py-8 text-center text-xs text-slate-400 dark:text-slate-500">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-500 dark:text-slate-400">Mengqur'an © {new Date().getFullYear()}</p>
          <p className="font-light mt-0.5">Membaca Al-Quran online secara modern & bersahaja.</p>
        </div>
        <div className="flex items-center gap-4 text-emerald-600 dark:text-emerald-400 font-medium">
          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-md text-emerald-600 dark:text-emerald-400 font-semibold select-none">
            API Muslim v3
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
