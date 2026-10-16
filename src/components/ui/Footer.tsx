import React from 'react';
import { ArrowUp } from 'lucide-react';
import { siteContent } from '../../content';
import { TideLine } from './TideLine';
import { SeaBrewLogo } from './SeaBrewLogo';

export const Footer: React.FC = () => {
  // Keep the footer wordmark static so reaching the page end never starts a
  // second scroll-linked animation.
  const letters = ['S', 'E', 'A', 'B', 'R', 'E', 'W'];

  return (
    <footer
      className="relative w-full bg-[#161617] text-[#FFFADE] pt-16 pb-12 overflow-hidden border-t border-[#A78040]/30 select-none"
      aria-label="فوتر پایانی وبسایت"
    >
      <div className="max-w-[1440px] mx-auto px-[6vw] flex flex-col items-center">
        {/* Scroll Progress TideLine completing at Footer */}
        <div className="w-full mb-12">
          <TideLine trackScrollProgress={false} sunPosition={50} color="#A78040" sunColor="#FDB716" />
        </div>

        {/* Static wordmark keeps the footer entrance motion-free. */}
        <div
          className="w-full flex flex-col items-center justify-center overflow-hidden py-4 my-4"
          aria-label="SEA BREW"
        >
          <SeaBrewLogo variant="mark-only" theme="light" size="lg" className="mb-4 opacity-90 hover:scale-105 transition-transform duration-300" />
          <div dir="ltr" className="font-black text-[clamp(3.5rem,14vw,11rem)] tracking-wider text-[#FFFADE] leading-none flex">
            {letters.map((char, idx) => (
              <span key={idx} className="inline-block">
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Direct channels — centered */}
        <div className="w-full mb-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`https://wa.me/${siteContent.contact.direct.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#A78040]/40 text-xs font-bold text-[#FFFADE] hover:text-[#161617] hover:bg-[#FDB716] hover:border-[#FDB716] transition-colors duration-300"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
              <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.79-1.68-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.65-1.57-.9-2.14-.23-.56-.47-.49-.65-.5h-.55c-.2 0-.5.07-.77.37-.27.3-1.02.99-1.02 2.42 0 1.42 1.04 2.8 1.19 2.99.15.2 2.05 3.13 4.96 4.28 2.42.95 2.91.76 3.44.71.52-.05 1.68-.69 1.92-1.35.24-.67.24-1.24.17-1.36-.07-.12-.27-.2-.57-.35zM12 2a10 10 0 0 0-8.6 15.1L2 22l5.05-1.32A10 10 0 1 0 12 2zm0 18.2c-1.5 0-2.96-.4-4.24-1.16l-.3-.18-3 .78.8-2.92-.2-.31A8.2 8.2 0 1 1 12 20.2z" />
            </svg>
            <span>{siteContent.contact.direct.whatsapp}</span>
          </a>

          <a
            href={`https://instagram.com/${siteContent.contact.direct.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#A78040]/40 text-xs font-bold text-[#FFFADE] hover:text-[#161617] hover:bg-[#FDB716] hover:border-[#FDB716] transition-colors duration-300"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
              <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.4.36 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.42 2.2-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.4.17-1 .36-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.42-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.17-.4-.36-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.8.42-2.2.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.4-.17 1-.36 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.14 0-3.5 0-4.74.07-1.14.05-1.76.24-2.17.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.17C2.4 8.5 2.4 8.86 2.4 12s0 3.5.07 4.74c.05 1.14.24 1.76.4 2.17.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.17.4 1.24.07 1.6.07 4.74.07s3.5 0 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.17.07-1.24.07-1.6.07-4.74s0-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.17a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.17-.4C15.5 4 15.14 4 12 4zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 1.8a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2zm5.1-.7a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0z" />
            </svg>
            <span>{siteContent.contact.direct.instagram}</span>
          </a>
        </div>

        {/* Origin & back-to-top */}
        <div className="w-full pt-8 border-t border-[#A78040]/20 flex flex-wrap items-center justify-center gap-6 text-xs font-bold tracking-widest uppercase text-[#C9B8B6] opacity-60">
          <span dir="ltr" className="font-mono text-[11px]">۲۸.۹۲۳۴° N, ۵۰.۸۲۶۴° E</span>
          <span>{siteContent.brand.origin}</span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="بازگشت به بالا"
            title="بازگشت به بالا"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#A78040]/40 text-[#A78040] hover:text-[#FFFADE] hover:border-[#FFFADE]/60 transition-colors duration-300 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFFADE]"
          >
            <ArrowUp className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
};
