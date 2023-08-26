const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql'); // mysql 사용
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



const dbConfig = {
  host: 'svc.sel3.cloudtype.app',
  port: '30382',
  user: 'gwang',
  password: 'Dlrhkddnjs1!',
  database: 'exhibitiondata'
};

const origins = [
  'https://web-bu-web-exhibition-fq2r52kllqhhlnh.sel3.cloudtype.app'
];

const corsOptions = {
  origin: origins,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// MariaDB 연결
const pool = mysql.createPool(dbConfig);


const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to the database');

  // 여기서 쿼리 실행 등의 작업 수행
});


// /users 경로로 GET 요청 처리
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users'; // users 테이블의 모든 열을 선택하는 SQL 쿼리

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results); // 결과를 JSON 형태로 응답
    console.log('done');
  });
});


app.get('/users/:id', cors(corsOptions), function (req, res, next) {
  res.json({ msg: 'https://web-bu-web-exhibition-fq2r52kllqhhlnh.sel3.cloudtype.app 규칙인 Origin에 대하여 개방' })
})


// 댓글 목록 가져오기
async function loadComments() {
  const response = await fetch('/comments');
  const comments = await response.json();

  // 댓글 목록 표시
  commentsList.innerHTML = '';
  comments.forEach(comment => {
    const li = document.createElement('li');
    li.textContent = comment.comment;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.addEventListener('click', async () => {
      const deletePassword = prompt('비밀번호를 입력하세요.');
      if (deletePassword) {
        const deleteResponse = await fetch(`/comments/${comment.comment_id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ password: deletePassword })
        });

        if (deleteResponse.ok) {
          // 댓글 삭제 성공 시 화면 갱신
          loadComments();
        } else {
          // 댓글 삭제 실패 시 처리
          console.error('댓글 삭제 실패');
        }
      }
    });

    li.appendChild(deleteButton);
    commentsList.appendChild(li);
  });
}



// 서버 시작
const port = 30382;
app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
