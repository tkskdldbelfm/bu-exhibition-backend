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



// /comments 경로로 POST 요청 처리
app.post('/comments', (req, res) => {
  const { target_id, nickname, password, comment } = req.body;

  const sql = `
    INSERT INTO comments (target_id, nickname, password, comment)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(sql, [target_id, nickname, password, comment], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json({ message: '댓글이 생성되었습니다.' });
  });
});


// /comments 경로로 GET 요청 처리
app.get('/comments', (req, res) => {
  const sql = 'SELECT * FROM comments'; // comments 테이블의 모든 열을 선택하는 SQL 쿼리

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results); // 결과를 JSON 형태로 응답
  });
});


// 댓글 삭제 요청 처리
app.post('/delete-comment', (req, res) => {
  const comment_id = req.body.comment_id;
  const password = req.body.password;

  // comment_id와 password를 사용하여 해당 댓글을 가져온 후 비교
  const selectQuery = 'SELECT * FROM comments WHERE comment_id = ?';
  connection.query(selectQuery, [comment_id], (selectError, selectResults) => {
    if (selectError) {
      console.error('Error selecting comment:', selectError);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }

    if (selectResults.length === 0) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    const comment = selectResults[0];
    if (comment.password !== password) {
      res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
      return;
    }

    // 비밀번호가 일치하면 댓글 삭제
    const deleteQuery = 'DELETE FROM comments WHERE comment_id = ?';
    connection.query(deleteQuery, [comment_id], (deleteError) => {
      if (deleteError) {
        console.error('Error deleting comment:', deleteError);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
      }
      res.json({ message: '댓글이 삭제되었습니다.' });
    });
  });
});


// 서버 시작
const port = 30382;
app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
