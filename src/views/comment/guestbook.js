
const guestbooksUrl = serverUrl + '/guestbooks';



document.addEventListener('DOMContentLoaded', () => {
    const commentsList = document.getElementById('commentsList');
    const commentForm = document.getElementById('commentForm');
    const nicknameInput = document.getElementById('nickname');
    const passwordInput = document.getElementById('password');
    const commentInput = document.getElementById('comment');

    // 댓글 작성 폼 제출 처리
    commentForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const guestname = nicknameInput.value;
        const password = passwordInput.value;
        const guestbook = commentInput.value;



        const response = await fetch(guestbooksUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({ guestname, password, guestbook })
        });

        if (response.ok) {
            // 댓글 작성 성공 시 화면 갱신
            loadComments();
            nicknameInput.value = '';
            passwordInput.value = '';
            commentInput.value = '';
            alert('댓글이 작성되었습니다.');
        } else {
            // 댓글 작성 실패 시 처리
            console.error('댓글 작성 실패');
            alert('서버에 문제가 발생하여 댓글 작성에 실패하였습니다. 다시 시도해주세요.'); // 실패 알람
        }
    });


    // 댓글 목록 가져오기 및 HTML 생성
    async function loadComments() {
        const response = await fetch(guestbooksUrl);
        const comments = await response.json();

        const commentsListContainer = document.getElementById('commentsList');
        commentsListContainer.innerHTML = ''; // 이전 댓글 목록 삭제

        comments.sort((a, b) => {
            // updated 속성을 Date 객체로 변환하여 비교합니다.
            const dateA = new Date(a.updated);
            const dateB = new Date(b.updated);

            // 내림차순 정렬 (최신 댓글이 먼저 오도록)
            return dateB - dateA;
        });

        const currentTime = new Date();

        comments.forEach(comment => {

            // 댓글의 생성 시간을 Date 객체로 변환합니다.
            const commentTime = new Date(comment.updated);

            // 현재 시간과 댓글 생성 시간의 차이를 계산합니다 (밀리초 단위).
            const timeDifference = currentTime - commentTime;

            // 1시간(밀리초로 3600000 밀리초) 내에 작성된 댓글인지 확인합니다.
            if (timeDifference <= 3600000) { // 최근 1시간 내에 작성된 경우
                comment.new = true; // "new" 플래그를 추가합니다.
            } else {
                comment.new = false; // "new" 플래그를 추가하지 않습니다.
            }

            if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(comment.updated)) {
                const updatedDateUTC = new Date(comment.updated);
                const updatedDateLocal = new Date(updatedDateUTC.getTime() - (9 * 60 * 60 * 1000)); // UTC+9 (KST)

                const formattedUpdatedDate = `${updatedDateLocal.getFullYear()}-${String(updatedDateLocal.getMonth() + 1).padStart(2, '0')}-${String(updatedDateLocal.getDate()).padStart(2, '0')} ${String(updatedDateLocal.getHours()).padStart(2, '0')}:${String(updatedDateLocal.getMinutes()).padStart(2, '0')}`;

                comment.updated = formattedUpdatedDate;
            }


            const commentContainer = document.createElement('div');
            commentContainer.classList.add('comment-container');
            const ul = document.createElement('ul');

            const li1 = document.createElement('li');
            li1.innerHTML = `${comment.guestname}<samp>${comment.updated} ${comment.new ? '<span class="new-tag">new</span>' : ''}</samp>`;
            ul.appendChild(li1);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '삭제하기';


            deleteButton.addEventListener('click', async () => {
                const deletePassword = prompt('비밀번호를 입력하세요.');
                if (deletePassword) {
                    const deleteResponse = await fetch(`${guestbooksUrl}/${comment.guestbook_id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Origin': 'https://web-bu-web-exhibition-fq2r52kllqhhlnh.sel3.cloudtype.app'

                        },
                        mode: 'cors',
                        body: JSON.stringify({ password: deletePassword })
                    });

                    if (deleteResponse.ok) {
                        loadComments(); // 댓글 삭제 성공 시 화면 갱신
                        alert('댓글이 삭제되었습니다.');
                    } else {
                        console.error('댓글 삭제 실패');
                        alert('비밀번호가 일치하지 않습니다.');
                    }
                }
            });

            ul.appendChild(deleteButton);

            commentContainer.appendChild(ul);

            const li3 = document.createElement('li');
            li3.textContent = comment.guestbook;
            commentContainer.appendChild(li3);

            commentsListContainer.appendChild(commentContainer);
        });
    }

    // 초기화: 댓글 목록 불러오기
    loadComments();



    // URL에서 파라미터 가져오는 함수
    //function getParameterByName(name) {
    //    const url = new URL(window.location.href);
    //    return url.searchParams.get(name);
    //}

});

