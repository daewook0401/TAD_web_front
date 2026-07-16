# task_1 구현계획서: 카테고리 아이콘 공개 URL E2E 시드 보정

## 분석 결과

- 프로덕션 React 컴포넌트는 URL을 직접 조합하지 않는다.
- 하드코딩된 URL은 E2E SQL 시드에 있다.
- 운영 DB의 이전 URL이 응답되어도 화면에 잘못된 주소가 전달되지 않도록 API 단계 정규화가 필요하다.

## 수정 예정 파일

- `e2e/local-smoke.spec.js`
- `src/api/boardAPI.js`
- `src/utils/drivePublicUrl.js`

## 테스트 계획

- `npm run lint`
- `npm run build`

## 승인

작업지시자의 추가 작업 지시로 승인되었다.
