'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, isLangEng } = useLanguage();
  const pathname = usePathname();

  const translations = {
    ko: {
      products: '제품 소개',
      unitPoint: '유닛포인트',
      company: '회사 소개',
      business: '비즈니스',
      magazine: '매거진',
      menuOpen: '메뉴 열기',
      logoAlt: '유닛하우스 로고',
    },
    en: {
      products: 'Products',
      unitPoint: 'Unit Point',
      company: 'Company',
      business: 'Business',
      magazine: 'Magazine',
      menuOpen: 'Open Menu',
      logoAlt: 'Unithaus Logo',
    },
  };

  const t = isLangEng ? translations.en : translations.ko;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center" style={{ marginTop: '18px' }}>
      <div
        className="flex items-center justify-between"
        style={{
          backgroundColor: 'rgba(228, 228, 228, 0.55)',
          borderRadius: '30px',
          padding: '0px 28px 0px 24px',
          minHeight: '70px',
          width: 'calc(100% - 40px)',
          maxWidth: '1256px',
        }}
      >
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between w-full">
          {/* Left: Logo */}
          <div className="flex items-center" style={{ minWidth: '80px', width: '80px', marginRight: '40px' }}>
            <Link href="/" className="block">
              <img
                src="/unitmaker_logo.svg"
                alt={t.logoAlt}
                style={{ width: '80px', height: 'auto' }}
              />
            </Link>
          </div>

          {/* Center: Navigation */}
          <div className="flex items-center" style={{ gap: '0px 60px' }}>
            <div className="flex items-center" style={{ gap: '0px 30px' }}>
              <div
                className="cursor-pointer"
                style={{
                  fontFamily: 'var(--font_default, Pretendard)',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--color_bTJRh_default, #222)',
                  textAlign: 'center',
                  lineHeight: 1,
                  marginTop: '2px',
                }}
              >
                {t.products}
              </div>
              <a
                href="https://unithaus.co.kr/unitpoint"
                target="_self"
                className="cursor-pointer"
                style={{
                  fontFamily: 'var(--font_default, Pretendard)',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--color_bTJRh_default, #222)',
                  textAlign: 'center',
                  letterSpacing: '-0.5px',
                  lineHeight: 1.5,
                  textDecoration: 'none',
                }}
              >
                {t.unitPoint}
              </a>
            </div>
          </div>

          {/* Right: Menu Items & Language Switch */}
          <div className="flex items-center justify-end" style={{ gap: '0px 20px', flexGrow: 1, paddingRight: '30px' }}>
            <div className="flex items-center" style={{ gap: '0px 30px' }}>
              <a
                href="https://unithaus.co.kr/company"
                target="_self"
                className="cursor-pointer"
                style={{
                  fontFamily: 'var(--font_default, Pretendard)',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--color_bTJRh_default, #222)',
                  textAlign: 'center',
                  letterSpacing: '-0.5px',
                  lineHeight: 1.5,
                  textDecoration: 'none',
                  minHeight: '20px',
                }}
              >
                {t.company}
              </a>
              <a
                href="https://unithaus.co.kr/business"
                target="_self"
                className="cursor-pointer"
                style={{
                  fontFamily: 'var(--font_default, Pretendard)',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--color_bTJRh_default, #222)',
                  textAlign: 'center',
                  letterSpacing: '-0.5px',
                  lineHeight: 1.5,
                  textDecoration: 'none',
                  minHeight: '20px',
                }}
              >
                {t.business}
              </a>
              <a
                href="https://unithaus.co.kr/magazine"
                target="_self"
                className="cursor-pointer"
                style={{
                  fontFamily: 'var(--font_default, Pretendard)',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--color_bTJRh_default, #222)',
                  textAlign: 'center',
                  letterSpacing: '-0.5px',
                  lineHeight: 1.5,
                  textDecoration: 'none',
                  minHeight: '20px',
                }}
              >
                {t.magazine}
              </a>
            </div>

            {/* Language Switch */}
            <div className="flex items-center" style={{ gap: '0px 8px' }}>
              <div
                style={{
                  fontFamily: 'pretendard_medium, Pretendard',
                  fontSize: '16px',
                  color: 'var(--color_text_default, #222)',
                  letterSpacing: '-0.5px',
                  lineHeight: 1.5,
                }}
              >
                {isLangEng ? 'ENG' : 'KOR'}
              </div>
              <div
                className="relative"
                style={{
                  width: '59px',
                  height: '34px',
                  padding: '2px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(243, 243, 243, 1)',
                  border: '2px solid rgba(213, 213, 213, 1)',
                  cursor: 'pointer',
                }}
                onClick={() => setLanguage(isLangEng ? 'ko' : 'en')}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    border: '1px solid rgba(213, 213, 213, 1)',
                    position: 'absolute',
                    top: '50%',
                    left: isLangEng ? 'calc(100% - 28px)' : '2px',
                    transform: 'translateY(-50%)',
                    transition: 'left 0.2s ease',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex items-center justify-between w-full">
          {/* Logo */}
          <div className="flex items-center" style={{ minWidth: '80px', width: '80px', marginRight: '20px' }}>
            <Link href="/" className="block">
              <img
                src="/unitmaker_logo.svg"
                alt={t.logoAlt}
                style={{ width: '80px', height: 'auto' }}
              />
            </Link>
          </div>

          {/* Right: Language & Menu Button */}
          <div className="flex items-center justify-end" style={{ gap: '0px 10px', flexGrow: 1, marginRight: '10px' }}>
            {/* Language Switch */}
            <div className="flex items-center" style={{ gap: '0px 8px' }}>
              <div
                style={{
                  fontFamily: 'pretendard_medium, Pretendard',
                  fontSize: '16px',
                  color: 'var(--color_text_default, #222)',
                  letterSpacing: '-0.5px',
                  lineHeight: 1.5,
                }}
              >
                {isLangEng ? 'ENG' : 'KOR'}
              </div>
              <div
                className="relative"
                style={{
                  width: '59px',
                  height: '34px',
                  padding: '2px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(243, 243, 243, 1)',
                  border: '2px solid rgba(213, 213, 213, 1)',
                  cursor: 'pointer',
                }}
                onClick={() => setLanguage(isLangEng ? 'ko' : 'en')}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    border: '1px solid rgba(213, 213, 213, 1)',
                    position: 'absolute',
                    top: '50%',
                    left: isLangEng ? 'calc(100% - 28px)' : '2px',
                    transform: 'translateY(-50%)',
                    transition: 'left 0.2s ease',
                  }}
                />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="cursor-pointer"
              style={{
                width: '24px',
                height: '16px',
                border: 'none',
                background: 'transparent',
                padding: 0,
              }}
              aria-label={t.menuOpen}
            >
              <svg
                width="24"
                height="16"
                viewBox="0 0 24 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="24" height="2" fill="currentColor" />
                <rect y="7" width="24" height="2" fill="currentColor" />
                <rect y="14" width="24" height="2" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed top-[88px] left-0 right-0 bg-white shadow-lg animate-fadeIn"
          style={{
            backgroundColor: 'rgba(228, 228, 228, 0.95)',
            borderRadius: '0 0 30px 30px',
            margin: '0 20px',
            padding: '20px 30px',
          }}
        >
          <nav className="flex flex-col space-y-4">
            <div
              className="cursor-pointer"
              style={{
                fontFamily: 'var(--font_default, Pretendard)',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--color_bTJRh_default, #222)',
              }}
            >
              {t.products}
            </div>
            <a
              href="https://unithaus.co.kr/unitpoint"
              target="_self"
              className="cursor-pointer"
              style={{
                fontFamily: 'var(--font_default, Pretendard)',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--color_bTJRh_default, #222)',
                textDecoration: 'none',
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.unitPoint}
            </a>
            <a
              href="https://unithaus.co.kr/company"
              target="_self"
              className="cursor-pointer"
              style={{
                fontFamily: 'var(--font_default, Pretendard)',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--color_bTJRh_default, #222)',
                textDecoration: 'none',
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.company}
            </a>
            <a
              href="https://unithaus.co.kr/business"
              target="_self"
              className="cursor-pointer"
              style={{
                fontFamily: 'var(--font_default, Pretendard)',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--color_bTJRh_default, #222)',
                textDecoration: 'none',
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.business}
            </a>
            <a
              href="https://unithaus.co.kr/magazine"
              target="_self"
              className="cursor-pointer"
              style={{
                fontFamily: 'var(--font_default, Pretendard)',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--color_bTJRh_default, #222)',
                textDecoration: 'none',
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t.magazine}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
