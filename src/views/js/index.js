// 이벤트 리스너를 등록하여 페이지가 로드되었을 때와 윈도우 크기가 변경될 때 source를 변경합니다.
document.addEventListener("DOMContentLoaded", function () {
    const videoSource = document.getElementById("videoSource");
    const bannerVideo = document.getElementById("banner");

    function updateVideoSource() {
        if (window.innerWidth <= 488) {
            videoSource.src = "./video/mobile_banner.webm";
        } else {
            videoSource.src = "./video/web_banner.webm";
        }
        // 비디오를 다시 로드하여 변경된 소스를 적용합니다.
        bannerVideo.load();
    }

    // 페이지 로드 시 소스 업데이트
    updateVideoSource();

    // 윈도우 크기 변경 시 소스 업데이트
    window.addEventListener("resize", updateVideoSource);
});

document.addEventListener("DOMContentLoaded", function () {
    const phrases = document.querySelectorAll(".pharse");
    const creadits = document.querySelectorAll(".creadit-username");
    const stillcuts = document.querySelectorAll(".stillcuts");

    function checkPhrases() {
        phrases.forEach((phrase) => {
            const rect = phrase.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

            // 스크롤 이벤트를 통해 요소가 화면에 나타날 때 페이드 인을 적용합니다.
            if (rect.top >= 0 && rect.bottom <= viewportHeight) {
                phrase.style.opacity = 1;
                phrase.style.transform = "translateY(0)";
            }
        });
    }


    function checkCreadit() {
        creadits.forEach((creadit) => {
            const rect = creadit.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

            // 스크롤 이벤트를 통해 요소가 화면에 나타날 때 페이드 인을 적용합니다.
            if (rect.top >= 0 && rect.bottom <= viewportHeight) {
                creadit.style.opacity = 1;
                creadit.style.transform = "translateY(0)";
            }
        });
    }

    function checkStillcut() {
        stillcuts.forEach((stillcut) => {
            const rect = stillcut.getBoundingClientRect();
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

            // 스크롤 이벤트를 통해 요소가 화면에 나타날 때 페이드 인을 적용합니다.
            if (rect.top >= 0 && rect.bottom <= viewportHeight) {
                stillcut.style.opacity = 1;
                stillcut.style.transform = "translateY(0)";
            }
        });
    }

    // 페이지 로드 시 초기 상태 확인
    checkCreadit();
    // 페이지 로드 시 초기 상태 확인
    checkPhrases();

    checkStillcut();

    // 스크롤 이벤트에 대한 리스너를 추가합니다.
    window.addEventListener("scroll", checkPhrases);
    window.addEventListener("scroll", checkStillcut);

    // 스크롤 이벤트에 대한 리스너를 추가합니다.
    window.addEventListener("scroll", checkCreadit);
});

document.addEventListener('DOMContentLoaded', async () => {
    const selectBg = document.querySelector(".selectBg");
    const selectListModal = document.querySelector(".selectListModal");
    const openSelectBtn = document.querySelector(".openSelectBtn");
    const modalContent = document.querySelector(".select.active.default");
    const creadit = document.querySelector(".creadit-username");
    const selectList = document.querySelector(".selectList");
    const underGraduateSection = document.querySelector("#underGraduate");





    // 사용자 데이터를 서버에서 가져오는 함수
    async function fetchUsersData() {
        const userData = await getUsersFromServer();
        return userData;
    }

    async function fetchWorksData() {
        const workData = await getWorksFromServer();
        return workData;
    }

    const userData = await fetchUsersData();
    const workData = await fetchWorksData();

    function createUsername(item) {
        const li = document.createElement("li");
        li.textContent = item.username;

        creadit.appendChild(li);
    }

    userData.forEach(createUsername);


    // select 요소 생성 함수
    function createSelectItem(item) {
        const selectItem = document.createElement("div");
        selectItem.classList.add("select");
        selectItem.setAttribute("data-id", item.id);

        const minImg = document.createElement("img");
        minImg.classList.add("minImg");
        minImg.src = item.profileimg;
        minImg.alt = item.username;

        const selectText = document.createElement("div");
        selectText.classList.add("selectText");

        const nameText = document.createElement("p");
        nameText.textContent = item.username; // 이름 username

        const contactWrap = document.createElement("div");
        contactWrap.classList.add("contactWrap");

        const userphone = document.createElement("p");
        userphone.textContent = item.user_phone;



        selectText.appendChild(nameText);
        contactWrap.appendChild(userphone);
        selectText.appendChild(contactWrap);

        selectItem.appendChild(minImg);
        selectItem.appendChild(selectText);

        // username 리스트 active 기능
        selectItem.addEventListener("click", async () => {
            // 기존 .active 제거
            const activeSelect = selectList.querySelector(".select.active");

            if (activeSelect) {
                activeSelect.classList.remove("active");
            }

            // 선택한 select에 .active 추가
            selectItem.classList.add("active");

            // 모달 내용 업데이트
            updateModalContent(item);

            // 선택한 데이터의 작업 업데이트
            const selectedId = selectItem.getAttribute('data-id');
            const selectedWorks = workData.filter((work) => work.work_id.toString() === selectedId);
            updateProjectCards(selectedWorks);
            // 프로젝트 카드 클릭 이벤트 리스너 추가

        });

        return selectItem;
    }





    // 웹뷰 리스트와 모달 내용 동기화 함수
    function updateModalContent(item) {
        const activeSelectModal = selectListModal.querySelector(".select.active");
        if (activeSelectModal) {
            activeSelectModal.classList.remove("active");
        }

        const modalSelect = selectListModal.querySelector(`.select[data-id="${item.id}"]`);
        if (modalSelect) {
            modalSelect.classList.add("active");
        }
    }


    // projectCard 업데이트 함수
    async function updateProjectCards(selectedWorks) {
        const projectCards = document.querySelectorAll('.projectCard');


        for (let index = 0; index < projectCards.length; index++) {
            const card = projectCards[index];
            const workname = card.querySelector('h3.bold');
            const projectImg = card.querySelector('.projectImg');
            const workintro = card.querySelector('p');

            if (selectedWorks.length > index) {
                const work = selectedWorks[index];

                workname.textContent = `${work.workname}` || "작업중입니다.";
                projectImg.src = work.workthumb || "./"; // 이미지 경로가 없을 경우 빈 문자열
                workintro.textContent = work.workintro || "설명이 없습니다.";

                card.addEventListener("click", () => {
                    // 프로필 페이지로 이동하며 유저 ID 함께 전달
                    window.location.href = `profileAll.html?id=${work.work_id}`;
                });

            } else {
                // 선택한 데이터가 3개 미만일 경우, 나머지 projectCard는 초기화
                workname.textContent = '';
                projectImg.src = '';
                workintro.textContent = '';
            }


        }
    }








    // select 요소 생성 및 추가
    userData.forEach((item) => {
        const selectItem = createSelectItem(item);
        selectItem.dataset.name = item.username; // data-name 속성 추가
        selectList.appendChild(selectItem);
        selectListModal.appendChild(selectItem.cloneNode(true)); // 모바일 모달에도 추가
    });

    // 최초로 첫 번째 항목 선택
    const firstSelect = selectList.querySelector(".select");
    firstSelect.classList.add("active");

    const selectedId = firstSelect.getAttribute('data-id');
    const firstWorkData = workData.filter((work) => work.work_id.toString() === selectedId);

    updateProjectCards(firstWorkData);
    updateModalContent(userData[0]);





    // 데이터의 name을 이용하여 해당 데이터를 가져오는 함수
    function getDataById(id) {
        return userData.find(item => item.id === id);
    }


    // 선택 옵션 클릭 시 모달 내용 업데이트
    selectListModal.addEventListener("click", async (event) => {
        const clickedOption = event.target.closest(".select");
        if (clickedOption) {
            // 기존 .select.active 제거
            const activeSelect = selectListModal.querySelector(".select.active");
            if (activeSelect) {
                activeSelect.classList.remove("active");
            }

            // 선택한 select에 .select.active 추가
            clickedOption.classList.add("active");

            // 선택한 .select의 data-id 값 가져오기
            const selectedId = clickedOption.getAttribute('data-id');

            // works 데이터 불러오기
            const workData = await fetchWorksData();
            const userData = await fetchUsersData();

            // 선택한 data-id 값으로 데이터 조회
            const selectedWorks = workData.filter((work) => work.work_id.toString() === selectedId);
            const selectedUser = userData.find((user) => user.id.toString() === selectedId);

            // 모달 내용 및 projectCard 업데이트
            updateProjectCards(selectedWorks);
            updateDefaultSelectWithData(selectedUser);
            closeModal(); // 옵션을 선택하면 모달 닫기
        }
    });




    // 뷰포트 너비가 488px 이하일 때 .selectArea 초기화 함수
    function resetSelectAreaWithActiveData() {
        const activeSelect = selectListModal.querySelector(".select.active.default");
        if (activeSelect) {
            const activeData = getDataById(activeSelect.querySelector(".selectText p").textContent);
            updateDefaultSelectWithData(activeData);
        }
    }

    //modal 업데이트 기능
    // active인 요소에서 데이터 가져오는 함수
    function getDataFromActiveElement() {
        const activeElement = selectList.querySelector(".selectListModal .select.active");

        if (activeElement) {
            const selectText = activeElement.querySelector(".selectText p").textContent;
            const minImgSrc = activeElement.querySelector(".minImg").src;

            return {
                selectText: selectText,
                minImgSrc: minImgSrc
            };
        }
        return null; // active 요소가 없을 경우

    }

    // .select.active.default 요소 업데이트 함수
    function updateDefaultSelectWithData(userData) {
        const activeSelect = document.querySelector(".select.active.default");
        if (activeSelect) {
            const minImg = activeSelect.querySelector(".minImg");
            const selectText = activeSelect.querySelector(".selectText p");

            // .active인 요소에서 가져온 데이터로 업데이트
            const activeData = getDataFromActiveElement();
            if (activeData) {
                minImg.src = activeData.minImgSrc || "";
                selectText.textContent = activeData.selectText || "";
            } else {
                // active 요소가 없을 경우 기본값으로 설정
                minImg.src = userData.profileimg || "";
                selectText.textContent = userData.username || "";
            }
        }
    }

    const lhj = document.getElementById('lhj');
    const wjs = document.getElementById('wjs');
    const text = document.querySelector('.text');

    lhj.addEventListener('click', () => {
        lhj.classList.add('active');
        wjs.classList.remove('active');
        text.firstElementChild.style.display = 'none';
        text.lastElementChild.style.display = 'block';
    });

    wjs.addEventListener('click', () => {
        wjs.classList.add('active');
        lhj.classList.remove('active');
        text.firstElementChild.style.display = 'block';
        text.lastElementChild.style.display = 'none';
    });



    // 모바일 selectListModal을 여는 버튼 관련 코드
    let isModalOpen = false;

    openSelectBtn.addEventListener("click", () => {
        if (isModalOpen) {
            closeModal();
        } else {
            openModal();
        }
    });

    selectListModal.addEventListener("click", (event) => {
        const clickedOption = event.target.closest(".select");
        if (clickedOption) {
            const optionName = clickedOption.querySelector(".selectText p").textContent;
            modalContent.querySelector(".selectText p").innerHTML = `<p>${optionName}</p>`;

            closeModal();
        }
    });

    function openModal() {
        selectBg.style.zIndex = "3";
        selectListModal.style.display = "block";
        isModalOpen = true;
        openSelectBtn.classList.add("open");
    }

    function closeModal() {
        selectBg.style.zIndex = "1";
        selectListModal.style.display = "none";
        isModalOpen = false;
        openSelectBtn.classList.remove("open");
    }

    document.addEventListener("click", (event) => {
        if (!selectListModal.contains(event.target) && event.target !== openSelectBtn) {
            closeModal();
        }
    });

    // 모달 내용을 선택된 데이터로 업데이트
    function updateModalContentWithSelectedData(userData) {
        if (userData) {
            const selectText = modalContent.querySelector(".selectText p");
            selectText.innerHTML = `<p>${userData.username}</p>`;

            const minImg = modalContent.querySelector(".minImg");
            minImg.src = userData.profileimg || "";
        }
    }





    // 초기에도 모달 내용 업데이트
    const initialData = userData[0]; // 예시로 첫 번째 데이터를 초기 데이터로 설정
    updateModalContentWithSelectedData(initialData);
    updateDefaultSelectWithData(initialData);







    // 프로젝트 슬라이더 관련 코드
    const projectsSlider = document.querySelector(".projectsSlider");
    const leftBtn = document.querySelector(".cardBtn.left");
    const rightBtn = document.querySelector(".cardBtn.right");
    const projectCardWidth = document.querySelector(".projectCard").offsetWidth;

    let currentIndex = 0;
    let isDragging = false;
    let startPosition = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;


    // 뷰포트 너비가 488px 이하일 경우에만 슬라이드 동작 활성화
    const isMobile = window.innerWidth <= 488;

    // 모바일에서 .selectArea 초기화
    if (isMobile) {
        window.addEventListener("resize", () => {
            if (isModalOpen && window.innerWidth <= 488) {
                resetSelectAreaWithActiveData();
            }
        });
    }



    // 슬라이더의 현재 인덱스 값에 따라 버튼의 가시성을 업데이트하는 함수
    function updateButtonVisibility() {
        if (currentIndex === 0) {
            leftBtn.classList.add("fade-out");
        } else {
            leftBtn.classList.remove("fade-out");
        }

        if (currentIndex === projectsSlider.children.length - 1) {
            rightBtn.classList.add("fade-out");
        } else {
            rightBtn.classList.remove("fade-out");
        }
    }

    // 초기 버튼 가시성 설정
    updateButtonVisibility();

    // 버튼 클릭 이벤트 리스너 등록
    leftBtn.addEventListener("click", () => {
        currentIndex = Math.max(currentIndex - 1, 0);
        updateSlide();
        updateButtonVisibility();
    });

    rightBtn.addEventListener("click", () => {
        currentIndex = Math.min(currentIndex + 1, projectsSlider.children.length - 1);
        updateSlide();
        updateButtonVisibility();
    });

    //터치 이벤트 리스너 삭제

    function animation() {
        projectsSlider.style.transform = `translateX(${currentTranslate}px)`;
        animationID = requestAnimationFrame(animation);
    }

    function updateSlide() {
        prevTranslate = currentTranslate = -currentIndex * projectCardWidth;
        projectsSlider.style.transition = "transform 0.3s ease-in-out";
        projectsSlider.style.transform = `translateX(${currentTranslate}px)`;
    }




});