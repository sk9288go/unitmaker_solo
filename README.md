# Unitmaker Standalone

독립적으로 동작하는 Unitmaker 애플리케이션입니다.

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 구조

- `app/` - Next.js 앱 라우터 파일
- `components/` - React 컴포넌트
- `types/` - TypeScript 타입 정의
- `public/data/` - JSON 데이터 파일
- `public/images/` - 이미지 파일 (원본 프로젝트에서 복사 필요)

## 필요한 이미지 파일

다음 이미지 파일들을 원본 프로젝트의 `public/images/` 폴더에서 복사해야 합니다:

- `unitmaker_logo.svg`
- `unitmaker_img/` 폴더 전체
- `360_img/` 폴더 전체

## 주의사항

이 프로젝트는 원본 프로젝트에서 분리된 독립 버전입니다. 이미지 파일들은 원본 프로젝트에서 복사해야 정상적으로 작동합니다.
