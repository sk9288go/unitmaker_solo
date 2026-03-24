"use client";

import React, { useEffect, useRef, useState } from 'react';

interface UnitDetailModalProps {
  open: boolean;
  onClose: () => void;
  unitId: string | null;
}

interface UnitDetailData {
  title: string;
  description: string;
  type: string;
  etc: string;
  price_wood?: number;
  price_steel?: number;
  url?: string;
  hashtags?: string[];
}

const pad = (num: number) => num.toString().padStart(3, '0');

const UnitDetailModal: React.FC<UnitDetailModalProps> = ({ open, onClose, unitId }) => {
  const [detail, setDetail] = useState<UnitDetailData | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [angles, setAngles] = useState<number[]>([]);
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const velocityRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const lastMoveTime = useRef<number | null>(null);
  const [imgScale, setImgScale] = useState(1.6);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [pinching, setPinching] = useState(false);
  const pinchStartDist = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const autoRotateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!unitId) return;
    fetch('/data/unit_details.json')
      .then(res => res.json())
      .then(data => setDetail(data[unitId] || null));
    fetch('/data/360_angles.json')
      .then(res => res.json())
      .then(data => setAngles(data[unitId] || []));
  }, [unitId]);

  useEffect(() => {
    setImgIdx(0);
  }, [unitId, angles]);

  useEffect(() => {
    if (open && angles.length > 0 && !dragging && !userInteracted) {
      autoRotateTimerRef.current = setInterval(() => {
        setImgIdx(prev => (prev + 1) % angles.length);
      }, 500);
    }
    return () => {
      if (autoRotateTimerRef.current) {
        clearInterval(autoRotateTimerRef.current);
        autoRotateTimerRef.current = null;
      }
    };
  }, [open, angles.length, dragging, userInteracted]);

  useEffect(() => {
    if (!dragging && animationRef.current) {
      animationRef.current = requestAnimationFrame(animateInertia);
    }
    if (dragging && animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [dragging]);

  const animateInertia = () => {
    if (Math.abs(velocityRef.current) < 0.01) {
      velocityRef.current = 0;
      animationRef.current = null;
      return;
    }
    setImgIdx(prev => {
      if (angles.length === 0) return 0;
      let next = prev + velocityRef.current;
      return ((Math.round(next) % angles.length) + angles.length) % angles.length;
    });
    velocityRef.current *= 0.95;
    animationRef.current = requestAnimationFrame(animateInertia);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true);
    setUserInteracted(true);
    dragStartX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    lastMoveTime.current = Date.now();
    velocityRef.current = 0;
    if (autoRotateTimerRef.current) {
      clearInterval(autoRotateTimerRef.current);
      autoRotateTimerRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const handleDragEnd = () => {
    setDragging(false);
    dragStartX.current = null;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging || dragStartX.current === null || angles.length === 0) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const delta = clientX - dragStartX.current;
    if (Math.abs(delta) > 20) {
      setImgIdx(prev => {
        if (angles.length === 0) return 0;
        let next = prev - Math.sign(delta);
        return ((next % angles.length) + angles.length) % angles.length;
      });
      const now = Date.now();
      const dt = now - (lastMoveTime.current || now);
      velocityRef.current = -Math.sign(delta) * Math.min(2, 30 / (dt || 1));
      lastMoveTime.current = now;
      dragStartX.current = clientX;
    }
  };

  useEffect(() => {
    if (!mounted) return;
    const el = viewerRef.current;
    if (!el) return;
    const handle = (e: WheelEvent) => {
      e.preventDefault();
      setImgScale(prev => {
        let next = prev - e.deltaY * 0.01;
        if (next < 1.6) next = 1.6;
        if (next > 4) next = 4;
        return next;
      });
    };
    el.addEventListener('wheel', handle, { passive: false });
    return () => el.removeEventListener('wheel', handle);
  }, [mounted]);

  const getTouchDist = (touches: any) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setPinching(true);
      pinchStartDist.current = getTouchDist(e.touches);
    } else {
      handleDragStart(e);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (pinching && e.touches.length === 2 && pinchStartDist.current) {
      const dist = getTouchDist(e.touches);
      const scaleChange = dist / pinchStartDist.current;
      setImgScale(prev => {
        let next = prev * scaleChange;
        if (next < 1.6) next = 1.6;
        if (next > 4) next = 4;
        return next;
      });
      pinchStartDist.current = dist;
    } else {
      handleDragMove(e);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setPinching(false);
    pinchStartDist.current = null;
    handleDragEnd();
  };

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  if (!open || !unitId) return null;

  const imgPath = angles.length > 0
    ? `/images/360_img/${unitId}/surround_${pad(angles[imgIdx])}.png`
    : '';

  const iconRotation = angles.length > 0 ? (angles[imgIdx] || 0) : 0;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  function formatKoreanPrice(price: number): string {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleOverlayClick}>
      <div className="bg-white rounded-lg shadow-lg w-[95vw] max-w-2xl max-h-[90vh] p-2 sm:p-4 relative animate-fadeIn flex flex-col justify-center overflow-y-auto">
        <button
          className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-black"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-3xl font-extrabold mb-2 text-left w-full">{(detail?.title || unitId)?.replace(/\s*상세$/, '')}</h2>
        {detail?.etc && (
          <div className="mb-4 w-fit">
            <span className="px-4 py-1 bg-black/80 text-brand-yellow text-base font-semibold rounded-md whitespace-nowrap">
              {detail.etc}
            </span>
          </div>
        )}
        {detail?.hashtags && detail.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {detail.hashtags.map(tag => (
              <span
                key={tag}
                className="outline outline-1 outline-gray-300 bg-gray-100/80 text-gray-600 px-2 py-0.5 rounded-full text-xs font-normal shadow-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div
          className="w-full max-w-full aspect-[16/9] bg-gray-100 rounded mb-2 overflow-hidden flex items-center justify-center select-none cursor-ew-resize relative overscroll-contain"
          style={{ touchAction: 'none', marginTop: 0, marginBottom: 0 }}
          ref={viewerRef}
          onMouseDown={e => {
            if (e.button === 0) {
              handleDragStart(e);
            }
          }}
          onMouseUp={e => {
            if (e.button === 0) handleDragEnd();
          }}
          onMouseLeave={e => {
            if (e.button === 0) handleDragEnd();
          }}
          onMouseMove={e => {
            if (dragging) handleDragMove(e);
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onTouchMove={handleTouchMove}
        >
          <div
            className="absolute top-2 right-2 bg-black/70 text-white w-7 h-7 flex items-center justify-center rounded-full z-20 pointer-events-none"
            style={{ transform: `rotate(${iconRotation}deg)` }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 3a7 7 0 1 1-7 7" stroke="white" strokeWidth="2" fill="none" />
              <path d="M3 7V3h4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {!isMobile && (
            <div className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-3 py-1 rounded shadow z-10 pointer-events-none text-right">
              마우스를 드래그해서 돌려보세요.<br className="sm:hidden" /> 휠로 확대/축소도 가능합니다.
            </div>
          )}
          {imgPath && (
            <img
              src={imgPath}
              alt="360 view"
              className="w-full h-full object-contain pointer-events-none transition-transform duration-300"
              style={{
                transform: `scale(${imgScale})`,
                objectPosition: 'center',
                cursor: imgScale > 1 ? 'zoom-out' : 'default',
                transition: 'transform 0.3s',
              }}
              draggable={false}
            />
          )}
        </div>
        {(detail?.price_wood || detail?.price_steel) && (
          <div className="flex flex-col gap-1 font-bold text-base min-w-[120px] mb-4 mt-4">
            <div className="relative w-fit">
              목구조 {detail.price_wood ? `${formatKoreanPrice(detail.price_wood)}~` : '-'}
              <span
                className="block absolute left-0 -bottom-0.5 w-full h-[2px] rounded-full"
                style={{ background: '#feb83f', opacity: 0.5 }}
              ></span>
            </div>
            <div className="relative w-fit">
              철골구조 {detail.price_steel ? `${formatKoreanPrice(detail.price_steel)}~` : '-'}
              <span
                className="block absolute left-0 -bottom-0.5 w-full h-[2px] rounded-full"
                style={{ background: '#feb83f', opacity: 0.5 }}
              ></span>
            </div>
          </div>
        )}
        <div className="w-full text-left mt-0 mb-2">
          <p className="mb-2 text-gray-700">
            {detail?.description || '아직 이 유닛의 상세 설명이 준비되지 않았습니다. 궁금하신 점은 문의해 주세요!'}
          </p>
        </div>
        {detail?.url && (
          <div className="flex flex-row gap-1 w-full justify-start mb-2">
            <a
              href={getCaseUrl(unitId, detail.type)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2 py-0.5 text-primary text-xs font-semibold bg-white border border-gray-300 rounded-full hover:bg-brand-yellow/10 transition min-w-[70px] justify-center"
              onClick={e => e.stopPropagation()}
            >
              시공사례 보기
            </a>
          </div>
        )}
        {detail?.url && (
          <div className="flex justify-center w-full mt-4 mb-2">
            <a
              href={detail.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-white px-6 py-3 rounded-md text-center transition-colors transition-transform duration-100 text-lg font-semibold hover:bg-[#feb83f] hover:text-black active:scale-95 shadow-md max-w-xs w-full"
              style={{margin: 0}}
              onClick={e => e.stopPropagation()}
            >
              하우스 만들러가기
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitDetailModal;
