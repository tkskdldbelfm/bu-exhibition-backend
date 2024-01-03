// 페이지가 로드될 때 실행
window.addEventListener("load", () => {
  // 헤더 엘리먼트 가져오기
  const header = document.querySelector("header");

  // 이전 스크롤 위치 저장
  let prevScrollPos = window.pageYOffset;

  // 스크롤 이벤트 리스너 등록
  window.addEventListener("scroll", () => {
    // 현재 스크롤 위치 가져오기
    const currentScrollPos = window.pageYOffset;

    // 스크롤 방향 계산
    if (prevScrollPos > currentScrollPos) {
      // 스크롤을 올릴 때: 헤더 표시
      header.style.opacity = "1";
    } else {
      // 스크롤을 내릴 때: 헤더 숨김
      header.style.opacity = "0";
    }

    // 현재 스크롤 위치를 이전 스크롤 위치로 업데이트
    prevScrollPos = currentScrollPos;
  });
});

