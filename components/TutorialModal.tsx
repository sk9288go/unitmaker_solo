"use client";

import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type TutorialStep = {
  title: string;
  description: string;
  image: string;
};

const tutorialStepsKo: TutorialStep[] = [
  {
    title: '1. 평수 선택하기',
    description: '원하는 평수 버튼을 클릭하여 선택하세요. 여러 평수를 동시에 선택할 수 있으며, 선택한 평수에 해당하는 유닛만 표시됩니다. 버튼을 다시 클릭하면 선택이 해제됩니다.',
    image: '/placeholder-unit.jpg',
  },
  {
    title: '2. 하우스 타입 선택하기',
    description: 'U-하우스, T-하우스, S-하우스, H-하우스 중 원하는 타입을 클릭하세요. 특정 타입을 선택하면 해당 타입의 유닛만 필터링되어 표시됩니다. 각 타입별로 사용 가능한 평수와 유닛 개수가 표시됩니다.',
    image: '/placeholder-unit.jpg',
  },
  {
    title: '3. 유닛 카드 탐색하기',
    description: '카드에 마우스를 올리면 여러 이미지를 자동으로 슬라이드하여 볼 수 있습니다. 카드를 클릭하면 상세 모달이 열리며, 360도 뷰와 자세한 정보를 확인할 수 있습니다.',
    image: '/placeholder-unit.jpg',
  },
  {
    title: '4. 정렬 및 필터링',
    description: '우측 상단의 정렬 옵션을 사용하여 가격순, 면적순, 침실 개수순, 욕실 개수순으로 정렬할 수 있습니다. 화살표 버튼으로 오름차순/내림차순을 전환할 수 있습니다.',
    image: '/placeholder-unit.jpg',
  },
  {
    title: '5. 상세 정보 확인하기',
    description: '각 유닛 카드에는 유닛 ID, 타입, 평수, 목구조/철골구조 가격 정보가 표시됩니다. "시공사례 보기" 버튼으로 실제 시공 사례를 확인하고, "하우스 만들러가기" 버튼으로 직접 설계를 시작할 수 있습니다.',
    image: '/placeholder-unit.jpg',
  },
  {
    title: '6. 360도 뷰 활용하기',
    description: '유닛 카드를 클릭하면 상세 모달이 열립니다. 모달에서 360도 뷰를 통해 유닛의 모든 각도를 확인할 수 있으며, 해시태그를 통해 유닛의 특징(침실 개수, 욕실 개수, 특화 기능 등)을 빠르게 파악할 수 있습니다.',
    image: '/placeholder-unit.jpg',
  },
];

const tutorialStepsEn: TutorialStep[] = [
  {
    title: '1. Select Size',
    description: 'Click the size buttons to select your desired sizes. You can select multiple sizes at once, and only units matching the selected sizes will be displayed. Click the button again to deselect.',
    image: '/placeholder-unit.jpg',
  },
  {
    title: '2. Choose House Type',
    description: 'Click on your preferred house type: U-House, T-House, S-House, or H-House. Selecting a specific type will filter and display only units of that type. Each type shows available sizes and the number of units.',
    image: '/placeholder-unit.jpg',
  },
  {
    title: '3. Explore Unit Cards',
    description: 'Hover over a card to automatically slide through multiple images. Click on a card to open a detailed modal where you can view 360° views and detailed information.',
    image: '/placeholder-unit.jpg',
  },
  {
    title: '4. Sort and Filter',
    description: 'Use the sort options in the top right to sort by price, size, number of bedrooms, or number of bathrooms. Use the arrow button to toggle between ascending and descending order.',
    image: '/placeholder-unit.jpg',
  },
  {
    title: '5. View Detailed Information',
    description: 'Each unit card displays the unit ID, type, size, and price information for wood/steel structures. Use the "View Case" button to see actual construction cases, and the "Create House" button to start designing directly.',
    image: '/placeholder-unit.jpg',
  },
  {
    title: '6. Use 360° View',
    description: 'Click on a unit card to open the detail modal. In the modal, you can view all angles of the unit through the 360° view, and quickly understand the unit\'s features (number of bedrooms, bathrooms, specialized functions, etc.) through hashtags.',
    image: '/placeholder-unit.jpg',
  },
];

const TutorialModal = () => {
  const { isLangEng } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = isLangEng ? tutorialStepsEn : tutorialStepsKo;
  const translations = {
    ko: {
      title: '유닛메이커 사용법',
      close: '닫기',
      prev: '이전',
      next: '다음',
      imageDesc: '설명 이미지',
    },
    en: {
      title: 'How to Use Unitmaker',
      close: 'Close',
      prev: 'Previous',
      next: 'Next',
      imageDesc: 'Description Image',
    },
  };

  const t = isLangEng ? translations.en : translations.ko;

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const nextStep = () => setCurrentStep((prev) => (prev + 1) % tutorialSteps.length);
  const prevStep = () => setCurrentStep((prev) => (prev - 1 + tutorialSteps.length) % tutorialSteps.length);

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center justify-center w-12 h-12 p-0 rounded-full bg-primary text-white shadow-lg hover:bg-black transition-colors md:w-auto md:h-auto md:px-4 md:py-2 md:gap-2"
        style={{ minWidth: 44 }}
      >
        <HelpCircle className="w-5 h-5" />
        <span className="hidden md:inline font-medium">{t.title}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 p-6 md:p-10 relative animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
              aria-label={t.close}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl relative overflow-hidden flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                  <span className="text-gray-400 text-sm block">{tutorialSteps[currentStep].title}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  {tutorialSteps[currentStep].title}
                </h3>
                <p className="text-gray-700 mb-8 leading-relaxed flex-grow">
                  {tutorialSteps[currentStep].description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex space-x-1">
                    {tutorialSteps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStep(index)}
                        className={`w-2 h-2 rounded-full ${
                          index === currentStep ? 'bg-primary' : 'bg-gray-300'
                        }`}
                        aria-label={`Go to tutorial step ${index + 1}`}
                      />
                    ))}
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={prevStep}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      {t.prev}
                    </button>
                    <button
                      onClick={currentStep === tutorialSteps.length - 1 ? closeModal : nextStep}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                      {currentStep === tutorialSteps.length - 1 ? (isLangEng ? 'Done' : '완료') : t.next}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TutorialModal;
