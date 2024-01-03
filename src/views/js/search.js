const serverUrl = 'https://bu-webdesign.site';

async function fetchDataFromServer(endpoint) {
  try {
    const response = await fetch(`${serverUrl}/${endpoint}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data from server (${endpoint}):`, error);
    return [];
  }
}

async function getUsersFromServer() {
  const endpoint = 'users';
  return await fetchDataFromServer(endpoint);
}

async function getWorksFromServer() {
  const endpoint = 'works';
  return await fetchDataFromServer(endpoint);
}

document.addEventListener('DOMContentLoaded', async () => {
  const searchButton = document.getElementById("searchButton");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const personalProfile = document.getElementById("personalProfile");
  const searchOutput = document.querySelector(
    "#personalProfile .contentsWrap"
  );

  // 사용자 데이터를 서버에서 가져오는 함수
  async function fetchUsersData() {
    const userData = await getUsersFromServer();
    return userData;
  }


  // 검색어를 입력하고 결과를 표시하는 함수
  async function displaySearchResults(searchTerm) {
    const userData = await fetchUsersData();
    const disassembledSearchTerm = disassembleKorean(searchTerm).toLowerCase();

    // 검색 결과를 필터링합니다.
    const matchedData = userData.filter((user) =>
      disassembleKorean(user.username)
        .toLowerCase()
        .includes(disassembledSearchTerm)
    );

    // 검색 결과를 표시합니다.
    displayAutocomplete(matchedData);
  }

  const searchDropdown = document.querySelector(".autocompleteList")


  // 검색 결과를 화면에 표시하는 함수
  function displayAutocomplete(matchedData) {
    searchResults.innerHTML = "";

    if (matchedData.length > 0) {
      const autocompleteList = document.createElement("ul");
      autocompleteList.classList.add("autocompleteList");


      matchedData.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = item.username;
        listItem.setAttribute("data-id", item.id);


        listItem.addEventListener("click", async function () {
          // 클릭한 카드의 id 값을 가져옴
          const userId = this.getAttribute("data-id");

          // 해당 사용자의 정보를 서버에서 가져옴
          try {
            const userResponse = await fetch(`${serverUrl}/users/${userId}`);
            const userData = await userResponse.json();
            // userData에는 해당 사용자의 정보가 담겨있을 것입니다.

            // profileAll 페이지로 이동하면서 사용자 정보를 전달
            window.location.href = `/profileAll.html?id=${userId}`;
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        });

        autocompleteList.appendChild(listItem);
      });

      searchResults.appendChild(autocompleteList);
    }
  }





  //문제없음
  //검색 후 클릭 시 id값을 담아 이동하게 해주는 함수
  async function showProfiles(userId) {
    if (userId) {
      const encodedUserId = encodeURIComponent(userId);
      window.location.href = `profileAll.html?id=${encodedUserId}`;
    } else {
      personalProfile.innerHTML = "검색 결과가 없습니다.";
    }
  }


  async function handleInput() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const userData = await getUsersFromServer(); // 서버에서 데이터 가져오기

    if (userData && userData.length > 0) {
      const matchedData = userData.filter(user => user.username.toLowerCase().includes(searchTerm));
      displayAutocomplete(matchedData);
    } else {
      // 데이터를 불러올 수 없는 경우 처리
      console.error("데이터를 불러올 수 없습니다.");
    }
  }


  // 프로필 페이지로 이동하는 함수
  function navigateToProfile(userId) {
    const encodedUserId = encodeURIComponent(userId);
    window.location.href = `profileAll.html?id=${encodedUserId}`;
  }


  // 한글 문자열을 자소 단위로 분해하는 함수
  function disassembleKorean(text) {
    const jasoArray = [];

    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);

      if (charCode >= 0xac00 && charCode <= 0xd7a3) {
        const offset = charCode - 0xac00;
        const lead = 0x1100 + Math.floor(offset / 588);
        const vowel = 0x1161 + Math.floor((offset % 588) / 28);
        const tail = 0x11a7 + (offset % 28);
        jasoArray.push(String.fromCharCode(lead));
        jasoArray.push(String.fromCharCode(vowel));
        if (tail !== 0x11a7) {
          jasoArray.push(String.fromCharCode(tail));
        }
      } else {
        jasoArray.push(text[i]);
      }
    }

    return jasoArray.join("");
  }

  // 검색 버튼 클릭 또는 Enter 키를 눌렀을 때 검색 결과 표시
  searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    displaySearchResults(searchTerm);
    showProfiles(userId);
  });

  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const searchTerm = searchInput.value.trim();
      displaySearchResults(searchTerm);
      showProfiles(userId);
    }
  });






  //아래부터 이전코드
  document.addEventListener("click", function (event) {
    if (!searchResults.contains(event.target) && event.target !== searchInput) {
      searchResults.innerHTML = "";
    }
  });

  searchInput.addEventListener("click", function (event) {
    if (searchResults.innerHTML.trim() === "") {
      handleInput();
    }
  });






  //프로필카드가 보여지도록 하는 함수
  function displayProfiles(userData) {
    searchOutput.innerHTML = "";

    userData.forEach(profile => {
      const profileCard = document.createElement("div");
      profileCard.classList.add("profileCard");
      profileCard.setAttribute("data-id", profile.id);

      const profileImg = document.createElement("img");
      profileImg.src = profile.profileimg; // userData 객체의 프로필 이미지 경로로 변경
      profileImg.alt = profile.username;
      profileImg.classList.add("profileImg");

      const profileName = document.createElement("p");
      profileName.textContent = profile.username;
      profileName.classList.add("profileCardName");

      profileCard.appendChild(profileImg);
      profileCard.appendChild(profileName);
      searchOutput.appendChild(profileCard);

      profileCard.addEventListener("click", async function () {
        // 클릭한 카드의 id 값을 가져옴
        const selectedUserId = this.getAttribute("data-id");

        // 해당 사용자의 정보를 서버에서 가져옴
        try {
          const userResponse = await fetch(`${serverUrl}/users/${selectedUserId}`);
          const userData = await userResponse.json();
          // userData에는 해당 사용자의 정보가 담겨있을 것입니다.

          // profileAll 페이지로 이동하면서 사용자 정보를 전달
          window.location.href = `/profileAll.html?id=${selectedUserId}`;
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      });
    });
  }

  // 검색어 입력 시 검색 결과를 표시하는 함수
  async function displaySearchResults(searchTerm) {
    searchOutput.innerHTML = ""; // 기존 프로필 카드 삭제
    searchResults.innerHTML = ""; // 기존 검색 결과 삭제

    // 서버에서 데이터 가져오기
    const userData = await getUsersFromServer();

    if (userData && userData.length > 0) {
      const disassembledSearchTerm = disassembleKorean(searchTerm).toLowerCase();
      const matchedData = userData.filter((user) =>
        disassembleKorean(user.username)
          .toLowerCase()
          .includes(disassembledSearchTerm)
      );

      if (matchedData.length > 0) {
        displayProfiles(matchedData);
      } else {
        searchResults.textContent = "검색 결과가 없습니다.";
      }

      // 자동완성 목록 표시
      displayAutocomplete(matchedData);
    } else {
      searchResults.textContent = "데이터를 불러올 수 없습니다.";
    }
  }

  // 검색어 입력란의 값이 변경될 때마다 검색 결과 표시
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim();
    displaySearchResults(searchTerm);
  });

  // 검색 버튼 클릭 시 검색 결과 표시
  searchButton.addEventListener("click", () => {
    const inputName = searchInput.value.trim();
    displaySearchResults(inputName);
  });


  //search.html로 이동 시 동작하는 코드
  //페이지 로드 시 프로필카드 전체를 불러옴
  window.addEventListener("load", async () => {

    try {
      const response = await fetch(`${serverUrl}/users`);
      const userData = await response.json();

      userData.forEach((user) => {
        const profileCard = document.createElement("div");
        profileCard.classList.add("profileCard");
        profileCard.setAttribute("data-id", user.id); // 사용자 id를 data-id 속성으로 설정

        const profileImg = document.createElement("img");
        profileImg.src = user.profileimg;
        profileImg.alt = user.username;
        profileImg.classList.add("profileImg");

        const profileName = document.createElement("p");
        profileName.textContent = user.username;
        profileName.classList.add("profileCardName");

        profileCard.appendChild(profileImg);
        profileCard.appendChild(profileName);
        searchOutput.appendChild(profileCard);

        profileCard.addEventListener("click", async function () {
          // 클릭한 카드의 id 값을 가져옴
          const selectedUserId = this.getAttribute("data-id");

          // 해당 사용자의 정보를 서버에서 가져옴
          try {
            const userResponse = await fetch(`${serverUrl}/users/${selectedUserId}`);
            const userData = await userResponse.json();
            // userData에는 해당 사용자의 정보가 담겨있을 것입니다.

            // profileAll 페이지로 이동하면서 사용자 정보를 전달
            window.location.href = `/profileAll.html?id=${selectedUserId}`;
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        });
      });
    } catch (error) {
      console.error('Error fetching user list:', error);
    }
  });
});








