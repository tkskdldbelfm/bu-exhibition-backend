// 폰트 크기를 조절할 함수
function adjustFontSize() {
    // 현재 화면 너비를 가져옵니다.
    const windowWidth = window.innerWidth;

    // 너비가 488px 이상일 때에만 폰트 크기 조절
    if (windowWidth > 488) {
        // 원하는 폰트 크기 계산
        const desiredFontSize = windowWidth / 120; // 원하는 폰트 크기를 조절할 수식으로 변경 가능

        // HTML 요소의 폰트 크기 설정
        document.documentElement.style.fontSize = desiredFontSize + 'px';
    }
}

// 초기 페이지 로드 시 폰트 크기 조절 함수 실행
window.addEventListener('load', adjustFontSize);

// 윈도우 크기 변경 시 폰트 크기 조절 함수 실행
window.addEventListener('resize', adjustFontSize);
