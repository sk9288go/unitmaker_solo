'use client';
// HEADER_UI_V2 — dropdown nav + KR/EN, no Unit Maker CTA (must match Git main)

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

type DropdownLink = { label: string; href: string };

type NavItem = {
  id: string;
  label: string;
  href: string;
  dropdown?: DropdownLink[];
};

function getNavItems(lang: 'ko' | 'en'): NavItem[] {
  if (lang === 'en') {
    return [
      {
        id: 'product',
        label: 'Products',
        href: 'https://unithaus.co.kr/',
        dropdown: [
          { label: 'FAQ', href: 'https://unithaus.co.kr/product?section=FAQ' },
          { label: 'Bespoke', href: 'https://unithaus.co.kr/bespoke' },
        ],
      },
      {
        id: 'b2b',
        label: 'B2B Solutions',
        href: 'https://unithaus.co.kr/unitpoint',
        dropdown: [
          { label: 'District development', href: 'https://unithaus.co.kr/unitpoint-cd' },
          { label: 'Mountain development', href: 'https://unithaus.co.kr/unitpoint-md' },
        ],
      },
      { id: 'company', label: 'Company', href: 'https://unithaus.co.kr/company' },
      { id: 'tech', label: 'Technical Solutions', href: 'https://unithaus.co.kr/business' },
      {
        id: 'magazine',
        label: 'Magazine',
        href: 'https://unithaus.co.kr/magazine',
        dropdown: [
          {
            label: 'Brand',
            href: 'https://unitlab.co.kr/unitmagazine/category/%EB%B8%8C%EB%9E%9C%EB%93%9C-%EC%86%8C%EA%B0%9C?_gl=1*1283rzv*_ga*NzI4NTc0MDExLjE3NzM5OTEzMDg.*_ga_GYGER0QGX4*czE3NzQzMTM4ODMkbzQkZzAkdDE3NzQzMTM4ODMkajYwJGwwJGgw',
          },
          {
            label: 'Curation',
            href: 'https://unitlab.co.kr/unitmagazine/category/%ED%81%90%EB%A0%88%EC%9D%B4%EC%85%98?_gl=1*1k707hj*_ga*NzI4NTc0MDExLjE3NzM5OTEzMDg.*_ga_GYGER0QGX4*czE3NzQzMTM4ODMkbzQkZzAkdDE3NzQzMTM4ODMkajYwJGwwJGgw',
          },
          {
            label: 'Our works',
            href: 'https://unitlab.co.kr/unitmagazine/category/%EC%8B%9C%EA%B3%B5-%EC%82%AC%EB%A1%80?_gl=1*1k707hj*_ga*NzI4NTc0MDExLjE3NzM5OTEzMDg.*_ga_GYGER0QGX4*czE3NzQzMTM4ODMkbzQkZzAkdDE3NzQzMTM4ODMkajYwJGwwJGgw',
          },
          {
            label: 'Architecture',
            href: 'https://unitlab.co.kr/unitmagazine/category/%EA%B1%B4%EC%B6%95-%EC%A0%95%EB%B3%B4?_gl=1*1k707hj*_ga*NzI4NTc0MDExLjE3NzM5OTEzMDg.*_ga_GYGER0QGX4*czE3NzQzMTM4ODMkbzQkZzAkdDE3NzQzMTM4ODMkajYwJGwwJGgw',
          },
          {
            label: 'News',
            href: 'https://unitlab.co.kr/unitmagazine/category/%EC%86%8C%EC%8B%9D?_gl=1*1k707hj*_ga*NzI4NTc0MDExLjE3NzM5OTEzMDg.*_ga_GYGER0QGX4*czE3NzQzMTM4ODMkbzQkZzAkdDE3NzQzMTM4ODMkajYwJGwwJGgw',
          },
        ],
      },
      {
        id: 'works',
        label: 'Our Works',
        href: 'https://unit.inblog.io/category/%EC%8B%9C%EA%B3%B5-%EC%82%AC%EB%A1%80',
      },
    ];
  }

  return [
    {
      id: 'product',
      label: '제품 소개',
      href: 'https://unithaus.co.kr/',
      dropdown: [
        { label: 'FAQ', href: 'https://unithaus.co.kr/product?section=FAQ' },
        { label: '비스포크', href: 'https://unithaus.co.kr/bespoke' },
      ],
    },
    {
      id: 'b2b',
      label: 'B2B 솔루션',
      href: 'https://unithaus.co.kr/unitpoint',
      dropdown: [
        { label: '단지개발', href: 'https://unithaus.co.kr/unitpoint-cd' },
        { label: '산지개발', href: 'https://unithaus.co.kr/unitpoint-md' },
      ],
    },
    { id: 'company', label: '회사 소개', href: 'https://unithaus.co.kr/company' },
    { id: 'tech', label: '기술 솔루션', href: 'https://unithaus.co.kr/business' },
    {
      id: 'magazine',
      label: '매거진',
      href: 'https://unithaus.co.kr/magazine',
      dropdown: [
        {
          label: '브랜드 소개',
          href: 'https://unitlab.co.kr/unitmagazine/category/%EB%B8%8C%EB%9E%9C%EB%93%9C-%EC%86%8C%EA%B0%9C?_gl=1*1283rzv*_ga*NzI4NTc0MDExLjE3NzM5OTEzMDg.*_ga_GYGER0QGX4*czE3NzQzMTM4ODMkbzQkZzAkdDE3NzQzMTM4ODMkajYwJGwwJGgw',
        },
        {
          label: '큐레이션',
          href: 'https://unitlab.co.kr/unitmagazine/category/%ED%81%90%EB%A0%88%EC%9D%B4%EC%85%98?_gl=1*1k707hj*_ga*NzI4NTc0MDExLjE3NzM5OTEzMDg.*_ga_GYGER0QGX4*czE3NzQzMTM4ODMkbzQkZzAkdDE3NzQzMTM4ODMkajYwJGwwJGgw',
        },
        {
          label: '시공사례',
          href: 'https://unitlab.co.kr/unitmagazine/category/%EC%8B%9C%EA%B3%B5-%EC%82%AC%EB%A1%80?_gl=1*1k707hj*_ga*NzI4NTc0MDExLjE3NzM5OTEzMDg.*_ga_GYGER0QGX4*czE3NzQzMTM4ODMkbzQkZzAkdDE3NzQzMTM4ODMkajYwJGwwJGgw',
        },
        {
          label: '건축정보',
          href: 'https://unitlab.co.kr/unitmagazine/category/%EA%B1%B4%EC%B6%95-%EC%A0%95%EB%B3%B4?_gl=1*1k707hj*_ga*NzI4NTc0MDExLjE3NzM5OTEzMDg.*_ga_GYGER0QGX4*czE3NzQzMTM4ODMkbzQkZzAkdDE3NzQzMTM4ODMkajYwJGwwJGgw',
        },
        {
          label: '소식',
          href: 'https://unitlab.co.kr/unitmagazine/category/%EC%86%8C%EC%8B%9D?_gl=1*1k707hj*_ga*NzI4NTc0MDExLjE3NzM5OTEzMDg.*_ga_GYGER0QGX4*czE3NzQzMTM4ODMkbzQkZzAkdDE3NzQzMTM4ODMkajYwJGwwJGgw',
        },
      ],
    },
    {
      id: 'works',
      label: '시공 사례',
      href: 'https://unit.inblog.io/category/%EC%8B%9C%EA%B3%B5-%EC%82%AC%EB%A1%80',
    },
  ];
}

const navLinkClass =
  'text-[16px] font-medium tracking-[-0.5px] text-[#222] no-underline transition-colors duration-150 hover:text-[#888]';

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function DesktopNavLink({ item }: { item: NavItem }) {
  if (!item.dropdown) {
    return (
      <a
        href={item.href}
        className={navLinkClass}
        style={{
          fontFamily: 'var(--font_default, Pretendard)',
          lineHeight: item.id === 'product' ? 1 : 1.5,
        }}
      >
        {item.label}
      </a>
    );
  }

  return (
    <div className="group relative flex items-center">
      <a
        href={item.href}
        className={`${navLinkClass} group-hover:text-[#888]`}
        style={{
          fontFamily: 'var(--font_default, Pretendard)',
          lineHeight: item.id === 'product' ? 1 : 1.5,
        }}
      >
        {item.label}
      </a>
      <div
        className="pointer-events-none invisible absolute left-1/2 top-full z-[1600] -translate-x-1/2 pt-12 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100"
        role="presentation"
      >
        <div
          className="flex min-w-max items-center justify-center gap-8 rounded-[14px] bg-white px-8 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]"
          style={{ fontFamily: 'var(--font_default, Pretendard)' }}
        >
          {item.dropdown.map((sub) => (
            <a
              key={sub.label}
              href={sub.href}
              className="text-[14px] font-medium tracking-[-0.3px] text-[#222] no-underline transition-colors hover:text-[#888]"
            >
              {sub.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const desktopNavItems = getNavItems(language);

  const enquiryLabel = language === 'en' ? 'Enquiry' : '상담 신청';
  const menuOpenLabel = language === 'en' ? 'Open menu' : '메뉴 열기';

  return (
    <header className="fixed top-0 left-0 right-0 z-[1507]">
      <div id="drop_filter" className="w-full bg-white px-[40px] shadow-[2px_2px_4px_0_rgba(170,170,170,1)] backdrop-blur-[5px]">
        <div className="mx-auto flex min-h-[84px] w-full items-center justify-between lg:hidden">
          <Link href="/" className="block">
            <img
              src="https://2e005bde5b8177f736ab4bdbf5632790.cdn.bubble.io/cdn-cgi/image/w=128,h=26,f=auto,dpr=1,fit=contain/f1763882356105x968589926989363500/Logo.png"
              alt="unithaus logo"
              className="h-auto w-[105px]"
            />
          </Link>
          <div className="flex items-center gap-[10px]">
            <a
              href="https://unithaus.co.kr/?section=enquiry"
              className="rounded-[35px] bg-[#222] px-[12px] py-[6px] text-[10px] font-medium leading-[1.5] tracking-[-0.5px] text-white no-underline"
              style={{ fontFamily: 'var(--font_default, Pretendard)' }}
            >
              {enquiryLabel}
            </a>
            {language === 'ko' ? (
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className="cursor-pointer border-none bg-transparent p-0"
                aria-label="Switch to English"
              >
                <img
                  src="https://2e005bde5b8177f736ab4bdbf5632790.cdn.bubble.io/cdn-cgi/image/w=48,h=25,f=auto,dpr=1,fit=contain/f1772168273244x916036417208532900/KR.png"
                  alt=""
                  className="h-[16px] w-[31px]"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setLanguage('ko')}
                className="flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-[#222]"
                aria-label="Switch to Korean"
              >
                <GlobeIcon className="h-4 w-4 shrink-0" />
                <span
                  className="text-[16px] font-medium tracking-[-0.5px]"
                  style={{ fontFamily: 'var(--font_default, Pretendard)' }}
                >
                  EN
                </span>
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="cursor-pointer border-none bg-transparent p-0 pl-[2px]"
              aria-label={menuOpenLabel}
            >
              <img
                src="https://2e005bde5b8177f736ab4bdbf5632790.cdn.bubble.io/cdn-cgi/image/w=32,h=21,f=auto,dpr=1,fit=contain/f1763951922456x371029390650290370/mobMenuIcon.png"
                alt="menu"
                className="h-[16px] w-[24px]"
              />
            </button>
          </div>
        </div>

        <div className="mx-auto hidden min-h-[84px] w-[1360px] min-w-[1360px] max-w-[1360px] items-center justify-between lg:flex">
          <div className="flex items-center gap-[70px]">
            <Link href="/" className="block">
              <img
                src="https://2e005bde5b8177f736ab4bdbf5632790.cdn.bubble.io/cdn-cgi/image/w=128,h=26,f=auto,dpr=1,fit=contain/f1763882356105x968589926989363500/Logo.png"
                alt="unithaus logo"
                className="h-auto w-[105px]"
              />
            </Link>
            <nav className="flex items-center gap-[30px]">
              {desktopNavItems.map((item) => (
                <DesktopNavLink key={item.id} item={item} />
              ))}
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-[22px]">
            <a
              href="https://unithaus.co.kr/?section=enquiry"
              className="rounded-[35px] bg-[#222] px-[14px] py-[8px] text-[16px] font-semibold leading-[1.5] tracking-[-0.5px] text-white no-underline"
              style={{ fontFamily: 'var(--font_default, Pretendard)' }}
            >
              {enquiryLabel}
            </a>
            {language === 'ko' ? (
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className="cursor-pointer border-none bg-transparent p-0"
                aria-label="Switch to English"
              >
                <img
                  src="https://2e005bde5b8177f736ab4bdbf5632790.cdn.bubble.io/cdn-cgi/image/w=48,h=25,f=auto,dpr=1,fit=contain/f1772168273244x916036417208532900/KR.png"
                  alt=""
                  className="h-[21px] w-[41px]"
                />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setLanguage('ko')}
                className="flex cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 text-[#222]"
                aria-label="Switch to Korean"
              >
                <GlobeIcon className="h-[21px] w-[21px] shrink-0" />
                <span
                  className="text-[16px] font-medium tracking-[-0.5px]"
                  style={{ fontFamily: 'var(--font_default, Pretendard)' }}
                >
                  EN
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white px-5 py-4 shadow-md">
          <nav className="flex flex-col space-y-3">
            {desktopNavItems.map((item) => (
              <div key={item.id}>
                <a
                  href={item.href}
                  className="text-[16px] font-medium leading-[1.5] tracking-[-0.5px] text-[#222] no-underline"
                  onClick={() => !item.dropdown && setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
                {item.dropdown && (
                  <div className="mt-2 ml-2 flex flex-col gap-2 border-l border-[#eee] pl-3">
                    {item.dropdown.map((sub) => (
                      <a
                        key={sub.label}
                        href={sub.href}
                        className="text-[14px] font-medium text-[#555] no-underline"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
