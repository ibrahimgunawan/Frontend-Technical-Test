"use client";

import { useEffect, useState } from "react";
import { SITE_NAME } from "@/lib/site";

export function AgeVerificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("age_verified")) {
      setTimeout(() => setIsOpen(true), 0);
    }
  }, []);

  const handleConfirmAge = () => {
    localStorage.setItem("age_verified", "true");
    setIsOpen(false);
  };

  const handleUnderAge = () => {
    setDenied(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 overflow-hidden p-6 select-none backdrop-blur-md">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[320px] h-[320px] sm:w-[520px] sm:h-[520px] md:w-[680px] md:h-[680px] bg-accent/20 rounded-full blur-[110px] sm:blur-[160px] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-xl w-full text-center space-y-7">
        {denied ? (
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide uppercase text-white font-heading">
              AKSES DITOLAK
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans max-w-md mx-auto">
              Maaf, Anda harus berusia minimal 21 tahun ke atas untuk dapat melihat dan mengakses produk di situs web <span className="text-accent font-semibold">{SITE_NAME}</span>.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  window.location.href = "https://www.google.com";
                }}
                className="px-6 py-2.5 rounded-full border border-neutral-600 text-white text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
              >
                Tinggalkan Situs
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="font-heading font-bold text-xl uppercase tracking-widest text-accent">
                  {SITE_NAME}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide uppercase text-white font-heading">
                VERIFIKASI USIA
              </h1>
            </div>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans max-w-md mx-auto">
              Untuk menggunakan situs web <span className="text-accent font-semibold">{SITE_NAME}</span> Anda harus berusia minimal 21 tahun ke atas.
              <br className="hidden sm:inline" /> Harap verifikasi usia Anda sebelum memasuki situs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1">
              <button
                type="button"
                onClick={handleUnderAge}
                className="w-full sm:w-auto min-w-[170px] px-6 py-2.5 rounded-full border border-neutral-600 text-neutral-300 text-sm font-medium hover:border-neutral-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
              >
                Di bawah 21 tahun
              </button>
              <button
                type="button"
                onClick={handleConfirmAge}
                className="w-full sm:w-auto min-w-[170px] px-6 py-2.5 rounded-full bg-accent text-accent-foreground text-sm font-bold shadow-lg shadow-accent/25 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                Saya berusia 21+
              </button>
            </div>

            <p className="text-[11px] sm:text-xs text-neutral-400 font-sans leading-relaxed max-w-lg mx-auto pt-6 border-t border-white/10">
              PERINGATAN: Produk ini mengandung nikotin. Nikotin adalah bahan kimia yang membuat ketagihan.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
