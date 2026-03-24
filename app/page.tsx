'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import TutorialModal from '@/components/TutorialModal';
import { Unit } from '@/types/unit';
import { useLanguage } from '@/contexts/LanguageContext';

const UnitDetailModal = dynamic(() => import('@/components/UnitDetailModal'), { ssr: false });

// 평수 버튼 목록
const sizeOptions = [6, 9, 12, 15, 18, 21, 24, 30];

// 해시태그 목록
const hashtagOptions = [
  { key: 'bedroom1', label: '침실 1개', labelEn: '1 Bedroom' },
  { key: 'bedroom2', label: '침실 2개', labelEn: '2 Bedrooms' },
  { key: 'bedroom3', label: '침실 3개', labelEn: '3 Bedrooms' },
  { key: 'bedroom4', label: '침실 4개', labelEn: '4 Bedrooms' },
  { key: 'bathroom1', label: '욕실 1개', labelEn: '1 Bathroom' },
  { key: 'bathroom2', label: '욕실 2개', labelEn: '2 Bathrooms' },
  { key: 'compact', label: '컴팩트', labelEn: 'Compact' },
  { key: 'secondroom', label: '세컨룸', labelEn: 'Second Room' },
  { key: 'multiroom', label: '멀티룸', labelEn: 'Multi Room' },
  { key: 'separated', label: '공간 분리', labelEn: 'Separated Space' },
  { key: 'kitchen', label: '주방 특화', labelEn: 'Kitchen Specialized' },
  { key: 'livingroom', label: '넓은 거실', labelEn: 'Large Living Room' },
  { key: 'outdoor', label: '아웃도어', labelEn: 'Outdoor' },
  { key: 'storage', label: '수납 특화', labelEn: 'Storage Specialized' },
  { key: 'courtyard', label: '중정', labelEn: 'Courtyard' },
  { key: 'floor2', label: '2층', labelEn: '2 Floors' },
];

// 정렬 옵션 (한국어)
const sortOptionsKo = [
  { value: 'price_wood', label: '가격순' },
  { value: 'size', label: '면적순' },
  { value: 'bedroom', label: '침실 개수순' },
  { value: 'bathroom', label: '욕실 개수순' },
];

// 정렬 옵션 (영어)
const sortOptionsEn = [
  { value: 'price_wood', label: 'Price' },
  { value: 'size', label: 'Size' },
  { value: 'bedroom', label: 'Bedrooms' },
  { value: 'bathroom', label: 'Bathrooms' },
];

// 가격 포맷 함수
function formatPrice(price: number, isEnglish: boolean = false): string {
  if (isEnglish) {
    // 영어일 때: 원화 표시와 million 단위 사용
    const priceInMillion = price / 1000000;
    if (priceInMillion >= 100) {
      // 100M 이상일 때
      const hundredMillion = Math.floor(priceInMillion / 100);
      const remainder = Math.floor(priceInMillion % 100);
      if (remainder === 0) {
        return `₩${hundredMillion}00M`;
      }
      return `₩${hundredMillion}${remainder.toString().padStart(2, '0')}M`;
    } else if (priceInMillion >= 1) {
      // 1M 이상 100M 미만
      return `₩${priceInMillion.toFixed(1)}M`;
    } else {
      // 1M 미만 (천 단위로 표시)
      return `₩${(price / 1000).toFixed(0)}K`;
    }
  } else {
    // 한국어일 때: 기존 형식 유지
    price = Math.floor(price / 10000);
    if (price >= 10000) {
      const eok = Math.floor(price / 10000);
      const man = price % 10000;
      if (man === 0) {
        return `${eok}억`;
      }
      return `${eok}억 ${man.toLocaleString()}만원`;
    }
    return `${price.toLocaleString()}만원`;
  }
}

// 하우스 타입별 대표 썸네일 이미지
const houseImages = [
  { type: 'U', src: '/images/unitmaker_img/thumbnails/Unit.png' },
  { type: 'T', src: '/images/unitmaker_img/thumbnails/t-haus.png' },
  { type: 'S', src: '/images/unitmaker_img/thumbnails/s-haus.png' },
  { type: 'H', src: '/images/unitmaker_img/thumbnails/h-haus.png' },
  { type: 'Custom', src: [
    '/images/unitmaker_img/thumbnails/rand.png',
    '/images/unitmaker_img/thumbnails/rand1.png',
    '/images/unitmaker_img/thumbnails/rand2.png',
    '/images/unitmaker_img/thumbnails/rand3.png',
  ] },
];

// 유닛별 이미지 매핑
const unitImages: Record<string, string[]> = {
  "u-9-1": ["/images/unitmaker_img/u-9-1/AAAA.jpg", "/images/unitmaker_img/u-9-1/Group 2.jpg", "/images/unitmaker_img/u-9-1/Group 3.jpg", "/images/unitmaker_img/u-9-1/Group 5.jpg", "/images/unitmaker_img/u-9-1/Group 11.jpg"],
  "u-6-2": ["/images/unitmaker_img/u-6-2/AAAA.jpg", "/images/unitmaker_img/u-6-2/Group 2.jpg", "/images/unitmaker_img/u-6-2/Group 3.jpg", "/images/unitmaker_img/u-6-2/Group 5.jpg", "/images/unitmaker_img/u-6-2/Group 7.jpg", "/images/unitmaker_img/u-6-2/Group 8.jpg"],
  "u-6-1": ["/images/unitmaker_img/u-6-1/AAAA.jpg", "/images/unitmaker_img/u-6-1/Group 2.jpg", "/images/unitmaker_img/u-6-1/Group 3.jpg", "/images/unitmaker_img/u-6-1/Group 4.jpg", "/images/unitmaker_img/u-6-1/Group 5.jpg", "/images/unitmaker_img/u-6-1/Group 6.jpg"],
  "t-21-2": ["/images/unitmaker_img/t-21-2/AAAA.jpg", "/images/unitmaker_img/t-21-2/Group 15.jpg", "/images/unitmaker_img/t-21-2/Group 18.jpg", "/images/unitmaker_img/t-21-2/Group 32.jpg", "/images/unitmaker_img/t-21-2/Group 39.jpg", "/images/unitmaker_img/t-21-2/Group 40.jpg"],
  "t-21-1": ["/images/unitmaker_img/t-21-1/AAAA.jpg", "/images/unitmaker_img/t-21-1/Group 27.jpg", "/images/unitmaker_img/t-21-1/Group 47.jpg", "/images/unitmaker_img/t-21-1/Group 63.jpg", "/images/unitmaker_img/t-21-1/Group 77.jpg", "/images/unitmaker_img/t-21-1/Group 80.jpg"],
  "t-18-3": ["/images/unitmaker_img/t-18-3/AAAA.jpg", "/images/unitmaker_img/t-18-3/Group 3.jpg", "/images/unitmaker_img/t-18-3/Group 5.jpg", "/images/unitmaker_img/t-18-3/Group 15.jpg", "/images/unitmaker_img/t-18-3/Group 17.jpg", "/images/unitmaker_img/t-18-3/Group 19.jpg"],
  "t-18-2": ["/images/unitmaker_img/t-18-2/AAAA.jpg", "/images/unitmaker_img/t-18-2/Group 3.jpg", "/images/unitmaker_img/t-18-2/Group 12.jpg", "/images/unitmaker_img/t-18-2/Group 14.jpg", "/images/unitmaker_img/t-18-2/Group 17.jpg", "/images/unitmaker_img/t-18-2/Group 19.jpg"],
  "t-18-1": ["/images/unitmaker_img/t-18-1/AAAA.jpg", "/images/unitmaker_img/t-18-1/Group 3.jpg", "/images/unitmaker_img/t-18-1/Group 5.jpg", "/images/unitmaker_img/t-18-1/Group 6.jpg", "/images/unitmaker_img/t-18-1/Group 8.jpg", "/images/unitmaker_img/t-18-1/Group 9.jpg"],
  "t-15-5": ["/images/unitmaker_img/t-15-5/AAAA.jpg", "/images/unitmaker_img/t-15-5/Group 2.jpg", "/images/unitmaker_img/t-15-5/Group 3.jpg", "/images/unitmaker_img/t-15-5/Group 4.jpg", "/images/unitmaker_img/t-15-5/Group 5.jpg"],
  "t-15-4": ["/images/unitmaker_img/t-15-4/AAAA.jpg", "/images/unitmaker_img/t-15-4/Group 5.jpg", "/images/unitmaker_img/t-15-4/Group 13.jpg", "/images/unitmaker_img/t-15-4/Group 15.jpg", "/images/unitmaker_img/t-15-4/Group 16.jpg"],
  "t-15-3": ["/images/unitmaker_img/t-15-3/AAAA.jpg", "/images/unitmaker_img/t-15-3/Group 4.jpg", "/images/unitmaker_img/t-15-3/Group 17.jpg", "/images/unitmaker_img/t-15-3/Group 18.jpg", "/images/unitmaker_img/t-15-3/Group 19.jpg", "/images/unitmaker_img/t-15-3/Group 20.jpg"],
  "t-15-2": ["/images/unitmaker_img/t-15-2/AAAA.jpg", "/images/unitmaker_img/t-15-2/Group 3.jpg", "/images/unitmaker_img/t-15-2/Group 5.jpg", "/images/unitmaker_img/t-15-2/Group 7.jpg", "/images/unitmaker_img/t-15-2/Group 8.jpg"],
  "t-15-1": ["/images/unitmaker_img/t-15-1/AAAA.jpg", "/images/unitmaker_img/t-15-1/Group 3.jpg", "/images/unitmaker_img/t-15-1/Group 4.jpg", "/images/unitmaker_img/t-15-1/Group 5.jpg", "/images/unitmaker_img/t-15-1/Group 6.jpg", "/images/unitmaker_img/t-15-1/Group 7.jpg"],
  "t-12-3": ["/images/unitmaker_img/t-12-3/AAAA.jpg", "/images/unitmaker_img/t-12-3/_T-12-3-ABA.jpg", "/images/unitmaker_img/t-12-3/_T-12-3-BAA.jpg", "/images/unitmaker_img/t-12-3/_T-12-3-BAB.jpg", "/images/unitmaker_img/t-12-3/_T-12-3-BBA.jpg", "/images/unitmaker_img/t-12-3/_T-12-3-BBB.jpg"],
  "t-12-2": ["/images/unitmaker_img/t-12-2/AAAA.jpg", "/images/unitmaker_img/t-12-2/T-12-2-ABAB.jpg", "/images/unitmaker_img/t-12-2/T-12-2-BAAB.jpg", "/images/unitmaker_img/t-12-2/T-12-2-BBAC.jpg", "/images/unitmaker_img/t-12-2/T-12-2-CACB.jpg", "/images/unitmaker_img/t-12-2/T-12-2-DBCD-1.jpg"],
  "t-12-1": ["/images/unitmaker_img/t-12-1/AAAA.jpg", "/images/unitmaker_img/t-12-1/BAC.jpg", "/images/unitmaker_img/t-12-1/BBA.jpg", "/images/unitmaker_img/t-12-1/CAB.jpg", "/images/unitmaker_img/t-12-1/CAC.jpg", "/images/unitmaker_img/t-12-1/CBC.jpg"],
  "s-18-1": ["/images/unitmaker_img/s-18-1/AAAA.jpg", "/images/unitmaker_img/s-18-1/Group 7.jpg", "/images/unitmaker_img/s-18-1/Group 11.jpg", "/images/unitmaker_img/s-18-1/Group 14.jpg", "/images/unitmaker_img/s-18-1/Group 18.jpg", "/images/unitmaker_img/s-18-1/Group 20.jpg"],
  "s-15-1": ["/images/unitmaker_img/s-15-1/AAAA.jpg", "/images/unitmaker_img/s-15-1/Group 2.jpg", "/images/unitmaker_img/s-15-1/Group 3.jpg", "/images/unitmaker_img/s-15-1/Group 4.jpg"],
  "h-30-1": ["/images/unitmaker_img/h-30-1/AAAA.jpg", "/images/unitmaker_img/h-30-1/ABAA.jpg", "/images/unitmaker_img/h-30-1/ABDB.jpg", "/images/unitmaker_img/h-30-1/DBCA.jpg", "/images/unitmaker_img/h-30-1/DBDB.jpg", "/images/unitmaker_img/h-30-1/EACB.jpg"],
  "h-24-2": ["/images/unitmaker_img/h-24-2/AAAA.jpg", "/images/unitmaker_img/h-24-2/BBAA.jpg", "/images/unitmaker_img/h-24-2/DABA.jpg", "/images/unitmaker_img/h-24-2/EABA.jpg", "/images/unitmaker_img/h-24-2/EBBA.jpg"],
  "h-24-1": ["/images/unitmaker_img/h-24-1/AAAA.jpg", "/images/unitmaker_img/h-24-1/BABA.jpg", "/images/unitmaker_img/h-24-1/CAAB.jpg", "/images/unitmaker_img/h-24-1/CBBB.jpg", "/images/unitmaker_img/h-24-1/EAAB.jpg", "/images/unitmaker_img/h-24-1/EBAB.jpg"],
  "h-21-2": ["/images/unitmaker_img/h-21-2/AAAA.jpg", "/images/unitmaker_img/h-21-2/BBBA.jpg", "/images/unitmaker_img/h-21-2/CAAB.jpg", "/images/unitmaker_img/h-21-2/EABA.jpg", "/images/unitmaker_img/h-21-2/EBBB.jpg"],
  "h-21-1": ["/images/unitmaker_img/h-21-1/AAAA.jpg", "/images/unitmaker_img/h-21-1/BABA.jpg", "/images/unitmaker_img/h-21-1/CAAB.jpg", "/images/unitmaker_img/h-21-1/CBBC.jpg", "/images/unitmaker_img/h-21-1/EAAB.jpg", "/images/unitmaker_img/h-21-1/EBBC.jpg"],
};

function getCaseUrl(unitId: string, type: string) {
  const id = unitId.toLowerCase();
  if (id.startsWith('s-18') || id.startsWith('s-15')) {
    return 'https://unit.inblog.ai/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%86%8C%EA%B0%9C-%EB%82%98%EB%A7%8C%EC%9D%98-%EC%83%9D%ED%99%9C%EC%9D%84-%EB%8B%B4%EC%9D%80-s18-%EB%A7%9E%EC%B6%A4%ED%98%95-%EB%AA%A8%EB%93%88%EB%9F%AC-%EC%A3%BC%ED%83%9D-49269';
  }
  if (id.startsWith('h-')) {
    return 'https://unit.inblog.ai/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%86%8C%EA%B0%9C-%EA%B0%80%EC%A1%B1%EC%9D%84-%EC%9C%84%ED%95%9C-30%ED%8F%89-%EB%B9%84%EC%8A%A4%ED%8F%AC%ED%81%AC-%EB%AA%A8%EB%93%88%EB%9F%AC-%ED%95%98%EC%9A%B0%EC%8A%A4-43797';
  }
  if (id.startsWith('t-12')) {
    return 'https://unit.inblog.ai/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%86%8C%EA%B0%9C-%EA%B8%B0%ED%9D%A5-%EC%9C%A0%EB%8B%9B%ED%95%98%EC%9A%B0%EC%8A%A4-%EC%87%BC%EB%A3%B8-31528';
  }
  if (id.startsWith('t-')) {
    return 'https://unit.inblog.ai/user-chats98496';
  }
  return 'https://unit.inblog.ai/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%86%8C%EA%B0%9C-%EB%82%98%EB%A7%8C%EC%9D%98-%EC%83%9D%ED%99%9C%EC%9D%84-%EB%8B%B4%EC%9D%80-s18-%EB%A7%9E%EC%B6%A4%ED%98%95-%EB%AA%A8%EB%93%88%EB%9F%AC-%EC%A3%BC%ED%83%9D-49269';
}

export default function UnitMakerPage() {
  const { isLangEng } = useLanguage();
  const [unitData, setUnitData] = useState<Unit[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>(sizeOptions);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
  const [houseTypeOrder, setHouseTypeOrder] = useState<string|null>(null);
  const [hoveredArr, setHoveredArr] = useState<boolean[]>([]);
  const [hoverIdxArr, setHoverIdxArr] = useState<number[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleArr, setVisibleArr] = useState<boolean[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUnitId, setModalUnitId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState('price_wood');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [customIdx, setCustomIdx] = useState(0);

  const translations = {
    ko: {
      heroTitle: '다양한',
      heroUnit: '유닛',
      heroSubtitle: '조합을 통해',
      heroSpace: '나만의 공간',
      heroAction: '을 만들어 보세요.',
      customHouse: '커스텀-하우스',
      house: '-하우스',
      clickCard: '카드를 클릭해서 자세한 정보를 살펴보세요',
      clickImage: '이미지를 클릭하면 360° 뷰를 볼 수 있습니다',
      type: '타입',
      woodStructure: '목구조',
      steelStructure: '철골구조',
      makeHouse: '하우스 만들러가기',
      viewCase: '시공사례 보기',
      noUnits: '조건에 맞는 유닛이 없습니다.',
      ascending: '오름차순',
      descending: '내림차순',
      pyeong: '평',
      sqm: '㎡',
    },
    en: {
      heroTitle: 'Create',
      heroUnit: 'your own space',
      heroSubtitle: 'through various',
      heroSpace: 'unit',
      heroAction: 'combinations.',
      customHouse: 'Custom House',
      house: ' House',
      clickCard: 'Click the card to see detailed information',
      clickImage: 'Click the image to view 360° view',
      type: 'Type',
      woodStructure: 'Wood Structure',
      steelStructure: 'Steel Structure',
      makeHouse: 'Create House',
      viewCase: 'View Case',
      noUnits: 'No units match the criteria.',
      ascending: 'Ascending',
      descending: 'Descending',
      pyeong: 'pyeong',
      sqm: 'sqm',
    },
  };

  const t = isLangEng ? translations.en : translations.ko;
  const sortOptions = isLangEng ? sortOptionsEn : sortOptionsKo;

  useEffect(() => {
    const customImages = houseImages.find(h => h.type === 'Custom')?.src || [];
    const interval = setInterval(() => {
      setCustomIdx(idx => (idx + 1) % customImages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/units.json');
        if (!response.ok) {
          throw new Error('Failed to fetch unit data');
        }
        const data = await response.json();
        setUnitData(data);
      } catch (error) {
        console.error('Error loading unit data:', error);
        setUnitData([]);
        setSelectedSizes(sizeOptions);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = unitData;
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(unit => selectedSizes.includes(unit.size));
    } else {
      filtered = [];
    }
    if (selectedHashtags.length > 0) {
      filtered = filtered.filter(unit =>
        selectedHashtags.some(tag => {
          const hashtagObj = hashtagOptions.find(opt => opt.key === tag);
          return unit.hashtags?.includes(hashtagObj?.label || '');
        })
      );
    }
    if (houseTypeOrder) {
      filtered = filtered.filter(u => u.type === houseTypeOrder);
    }
    filtered = [...filtered].sort((a, b) => {
      let aVal, bVal;
      if (sortKey === 'price_wood') {
        aVal = a.price_wood || 0;
        bVal = b.price_wood || 0;
      } else if (sortKey === 'size') {
        aVal = a.size;
        bVal = b.size;
      } else if (sortKey === 'bedroom') {
        aVal = (a.hashtags?.find(h => h.includes('침실'))?.match(/\d+/)?.[0]) || '0';
        bVal = (b.hashtags?.find(h => h.includes('침실'))?.match(/\d+/)?.[0]) || '0';
        aVal = parseInt(aVal, 10);
        bVal = parseInt(bVal, 10);
      } else if (sortKey === 'bathroom') {
        aVal = (a.hashtags?.find(h => h.includes('욕실'))?.match(/\d+/)?.[0]) || '0';
        bVal = (b.hashtags?.find(h => h.includes('욕실'))?.match(/\d+/)?.[0]) || '0';
        aVal = parseInt(aVal, 10);
        bVal = parseInt(bVal, 10);
      } else {
        aVal = 0;
        bVal = 0;
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
    setFilteredUnits(filtered);
  }, [selectedSizes, selectedHashtags, unitData, houseTypeOrder, sortKey, sortOrder]);

  useEffect(() => {
    setHoveredArr(Array(filteredUnits.length).fill(false));
    setHoverIdxArr(Array(filteredUnits.length).fill(0));
  }, [filteredUnits]);

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    const arr = isMobile ? visibleArr : hoveredArr;
    arr.forEach((active, i) => {
      if (active) {
        intervals[i] = setInterval(() => {
          setHoverIdxArr(prev => {
            const newArr = [...prev];
            const images = unitImages[filteredUnits[i]?.id?.toLowerCase()] || [];
            const hoverImagesLen = Math.max(images.length - 1, 1);
            newArr[i] = (newArr[i] + 1) % hoverImagesLen;
            return newArr;
          });
        }, 400);
      }
    });
    return () => intervals.forEach(interval => interval && clearInterval(interval));
  }, [hoveredArr, visibleArr, filteredUnits, isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    setVisibleArr(Array(filteredUnits.length).fill(false));
    const observer = new window.IntersectionObserver(
      (entries) => {
        setVisibleArr((prev) => {
          const newArr = [...prev];
          entries.forEach((entry) => {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            newArr[idx] = entry.isIntersecting;
          });
          return newArr;
        });
      },
      { threshold: 0.7, rootMargin: '-30% 0px -30% 0px' }
    );
    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
      observer.disconnect();
    };
  }, [filteredUnits, isMobile]);

  const handleHouseTypeClick = (type: string) => {
    const sizes = unitData
      .filter(unit => unit.type === type)
      .map(unit => unit.size);
    const uniqueSizes = Array.from(new Set(sizes));
    setSelectedSizes(uniqueSizes);
    setHouseTypeOrder(type);
  };

  return (
    <>
      <h1 className="sr-only">유닛메이커 - 5분 안에 완성하는 나만의 공간 설계</h1>
      <div className="container mx-auto px-2 sm:px-4 md:px-[5vw] lg:px-16 py-4 md:py-6 md:max-w-[90vw] lg:max-w-7xl">
        <div className="flex justify-end mb-4">
          <TutorialModal />
        </div>
        <div className="unitmaker-hero relative flex flex-col items-center justify-center text-center py-4 md:py-5 mb-2">
          <div className="unitmaker-hero-logo-wrapper mb-4 md:mb-6 w-full flex justify-center items-center">
            <img src="/unitmaker_logo.svg" alt="Unitmaker Logo" className="w-36 md:w-48 lg:w-64 mx-auto drop-shadow-sm" />
          </div>
          <div className="unitmaker-hero-heading-wrapper w-full flex justify-center">
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight md:leading-tight mb-0 text-center text-gray-900">
              {isLangEng ? (
                <>
                  {t.heroTitle} <span className="text-brand-yellow drop-shadow-sm">{t.heroUnit}</span><br />
                  {t.heroSubtitle} <span className="text-brand-yellow drop-shadow-sm">{t.heroSpace}</span> {t.heroAction}
                </>
              ) : (
                <>
                  {t.heroTitle} <span className="text-brand-yellow drop-shadow-sm">{t.heroUnit}</span> {t.heroSubtitle}<br />
                  <span className="text-brand-yellow drop-shadow-sm">{t.heroSpace}</span>{t.heroAction}
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-10 py-1 mb-3 md:mb-4">
          {houseImages.map((item) => {
            const count = item.type === 'Custom'
              ? 0
              : unitData.filter(unit => selectedSizes.includes(unit.size) && unit.type === item.type).length;
            const isActive = houseTypeOrder
              ? houseTypeOrder === item.type
              : unitData.some(unit => selectedSizes.includes(unit.size) && unit.type === item.type);
            const borderClass = item.type === 'Custom'
              ? 'border-2 border-brand-yellow'
              : (isActive ? 'border-2 border-primary' : 'border border-gray-200');
            return (
              <div key={item.type} className="flex flex-col items-center">
                <div
                  className={`relative w-12 h-12 md:w-20 md:h-20 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 overflow-visible transition-all duration-300 p-1.5 md:p-2
                    ${(item.type === 'Custom' || isActive) ? 'opacity-100 scale-105 shadow-xl ring-2 ring-primary/20' : 'opacity-40 scale-95'}
                    ${borderClass}
                    ${item.type !== 'Custom' ? 'cursor-pointer hover:scale-110 hover:shadow-lg' : ''}`}
                  style={item.type === 'Custom' ? { cursor: 'pointer' } : undefined}
                  onClick={item.type === 'Custom'
                    ? () => window.open('https://unithaus.co.kr/business', '_blank')
                    : () => handleHouseTypeClick(item.type)}
                >
                  {item.type === 'Custom' ? (
                    <img src={item.src[customIdx]} alt="Custom" className="w-full h-full object-contain transition-all duration-500" />
                  ) : (
                    <img src={item.src} alt={item.type} className="w-full h-full object-contain" />
                  )}
                  {isActive && count > 0 && (
                    <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-7 h-7 flex items-center justify-center font-bold shadow-md z-30">
                      {count}
                    </span>
                  )}
                </div>
                <span className="text-xs md:text-base text-center text-gray-700 mt-1 font-semibold">{item.type === 'Custom' ? t.customHouse : `${item.type}${t.house}`}</span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3 items-center justify-center mb-4 md:mb-6">
          {sizeOptions.map(size => (
            <button
              key={size}
              className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full font-semibold text-sm md:text-base transition-all duration-200 ${
                selectedSizes.includes(size) 
                  ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/30 scale-105' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-primary/50 hover:shadow-md hover:scale-105'
              }`}
              onClick={() => {
                setSelectedSizes(prev => {
                  const newSizes = prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size];
                  if (newSizes.length !== 1) setHouseTypeOrder(null);
                  return newSizes;
                });
              }}
            >
              {isLangEng ? `${(size * 3.3).toFixed(0)} sqm` : `${size}${t.pyeong}`}
            </button>
          ))}
        </div>

        <div className="w-full flex flex-row items-center justify-between mb-4 md:mb-6">
          <div className="text-xs md:text-sm text-gray-500 text-center font-medium">{t.clickCard}</div>
          <div className="flex items-center gap-2 md:gap-3">
            <select
              className="text-xs md:text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-yellow/30 focus:border-brand-yellow transition-all shadow-sm hover:shadow-md"
              value={sortKey}
              onChange={e => setSortKey(e.target.value)}
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              className="text-xs md:text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md"
              onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
              title={sortOrder === 'asc' ? t.ascending : t.descending}
            >
              {sortOrder === 'asc' ? '▲' : '▼'}
            </button>
          </div>
        </div>

        <div className="mt-2 md:mt-3 grid gap-3 md:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUnits.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-12 text-lg">{t.noUnits}</div>
          )}
          {filteredUnits.map((unit, i) => {
            const images = unitImages[unit.id.toLowerCase()] || [];
            const mainImage = images[0];
            const hoverImages = images.slice(1);
            const isActive = isMobile ? visibleArr[i] : hoveredArr[i];

            return (
              <div
                key={unit.id}
                ref={el => { cardRefs.current[i] = el; }}
                data-index={i}
                className={`border border-gray-200/60 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-center transform cursor-pointer ${
                  isMobile ? (isActive ? ' scale-[1.02] shadow-lg' : '') : ' hover:scale-[1.02] hover:border-gray-300'
                }`}
                onMouseEnter={() => !isMobile && setHoveredArr(prev => {
                  const arr = [...prev];
                  arr[i] = true;
                  return arr;
                })}
                onMouseLeave={() => !isMobile && setHoveredArr(prev => {
                  const arr = [...prev];
                  arr[i] = false;
                  return arr;
                })}
                onClick={() => { setModalUnitId(unit.id.toLowerCase()); setModalOpen(true); }}
              >
                <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden rounded-t-xl">
                  {mainImage && (
                    <img
                      src={mainImage}
                      alt={unit.id}
                      className="absolute inset-0 w-full h-full object-cover z-10"
                    />
                  )}
                  {isActive && hoverImages.length > 0 && (
                    <img
                      src={hoverImages[hoverIdxArr[i] % hoverImages.length]}
                      alt={`${unit.id}-hover`}
                      className="absolute inset-0 w-full h-full object-cover z-20 opacity-100 transition-opacity duration-300"
                    />
                  )}
                  <a
                    href={getCaseUrl(unit.id, unit.type)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 z-20 inline-flex items-center px-3 py-1.5 text-primary text-xs font-semibold bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full hover:bg-brand-yellow hover:text-white hover:border-brand-yellow transition-all min-w-[80px] justify-center shadow-md hover:shadow-lg"
                    onClick={e => e.stopPropagation()}
                  >
                    {t.viewCase}
                  </a>
                  {unit.hashtags && unit.hashtags.length > 0 && (
                    <div className="absolute left-3 top-3 z-30 hidden lg:flex flex-wrap gap-1.5">
                      {unit.hashtags.map(tag => {
                        const tagObj = hashtagOptions.find(opt => opt.key === tag || opt.label === tag || opt.labelEn === tag);
                        const tagLabel = tagObj 
                          ? (isLangEng ? tagObj.labelEn : tagObj.label)
                          : tag;
                        return (
                          <span
                            key={tag}
                            className="bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full text-[10px] md:text-[11px] lg:text-xs font-medium shadow-md border border-gray-100"
                          >
                            #{tagLabel}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500 text-center mt-2 mb-3 px-4 font-medium">{t.clickImage}</div>
                <div className="flex flex-row items-center justify-between px-5 gap-3 py-3 bg-gray-50/50">
                  <div className="flex flex-row w-full">
                    <div className="flex-1 pt-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-1.5">{unit.id}</h3>
                      <div className="flex flex-row items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs font-semibold text-primary bg-primary/10 rounded-md px-2.5 py-1 border border-primary/20 whitespace-nowrap">{unit.type?.toUpperCase()} {t.type}</span>
                        <span className="text-gray-600 text-xs font-medium">
                          {isLangEng 
                            ? `${(unit.size * 3.3).toFixed(1)} sqm` 
                            : `${unit.size}${t.pyeong} (${(unit.size * 3.3).toFixed(1)}${t.sqm})`
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5 font-bold text-base items-start justify-center text-left">
                      <div className="font-semibold text-sm leading-tight text-gray-800 whitespace-nowrap">
                        {t.woodStructure} <span className="text-primary">{unit.price_wood ? `${formatPrice(unit.price_wood, isLangEng)}~` : '-'}</span>
                      </div>
                      <div className="font-semibold text-sm leading-tight text-gray-800 whitespace-nowrap">
                        {t.steelStructure} <span className="text-primary">{unit.price_steel ? `${formatPrice(unit.price_steel, isLangEng)}~` : '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {unit.url && (
                  <div className="flex flex-col w-full gap-2 mt-2 px-5 pb-5">
                    <a
                      href={unit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-brand-yellow to-brand-yellow/90 text-gray-900 px-4 py-3 rounded-lg text-center transition-all duration-200 text-base font-bold hover:from-brand-yellow/90 hover:to-brand-yellow hover:shadow-lg active:scale-[0.98] w-full shadow-md hover:shadow-xl"
                      onClick={e => e.stopPropagation()}
                    >
                      {t.makeHouse}
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {modalOpen && (
          <UnitDetailModal open={modalOpen} onClose={() => setModalOpen(false)} unitId={modalUnitId} />
        )}
      </div>
    </>
  );
}
