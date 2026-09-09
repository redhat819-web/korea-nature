# 트러블슈팅 기록

## 2026-09-09 — 배포 사이트에서 "이미지 안 뜨고 텍스트만 보임"

**증상**
GitHub Pages(`https://redhat819-web.github.io/korea-nature/`)에서 페이지를 열었을 때 배경이 검게만 보이고
텍스트만 표시되며 사진(`.scene__bg` 이미지)이 전혀 나오지 않는다는 리포트.

**확인한 것**
- 로컬 `assets/images/*.webp` 5개 파일 전부 정상 존재, git에도 커밋되어 있음 (`git ls-files`).
- 배포 서버에 직접 `curl`로 확인 — `index.html`과 모든 `.webp` 파일이 200 OK, 올바른
  `Content-Type: image/webp`로 응답.
- 배포된 `index.html`을 받아 로컬 파일과 `diff` — 완전히 동일. 즉 최신 수정 커밋
  (`6f645a2 Fix images not rendering in plain-flow mode`, `11de318 Fix blank-page risk when
  GSAP fails to load or is slow`)이 이미 정상적으로 배포되어 있었음.

**원인**
서버/코드 문제가 아니라 **브라우저 캐시**였음. GitHub Pages에 방금 반영된 최신 빌드를
사용자 브라우저가 그 이전(이미지 미표시 버그가 있던) 버전으로 캐시하고 있었던 것으로 추정.

**해결**
하드 리프레시(`Ctrl+Shift+R`) 또는 시크릿 창으로 재접속 → 정상적으로 이미지 표시 확인됨.

**교훈 / 다음에 참고할 점**
- "화면이 이상하다"는 리포트를 받으면 로컬 코드/에셋 상태 확인과 별개로, 배포된 URL을
  `curl`로 직접 찔러 서버 응답을 먼저 검증하면 코드 문제와 캐시 문제를 빠르게 구분할 수 있다.
- GitHub Pages는 배포 직후 CDN/브라우저 캐시가 이전 버전을 잠깐 물고 있을 수 있으므로,
  배포 직후 확인할 때는 항상 하드 리프레시 또는 시크릿 창을 먼저 시도해볼 것.
