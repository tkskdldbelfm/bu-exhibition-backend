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
  const sql = 'SELECT target_id, nickname, updated, comment FROM users;'; // users 테이블의 모든 열을 선택하는 SQL 쿼리

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

// 댓글 작성 API
app.post('/comments', async (req, res) => {
  const { target_id, nickname, password, comment } = req.body;
  const insertQuery = 'INSERT INTO comments (target_id, nickname, password, comment) VALUES (?, ?, ?, ?)';

  try {
    await connection.query(insertQuery, [target_id, nickname, password, comment], (err, result) => {
      if (err) {
        throw new Error('Error creating comment:', err)
      } else {
        const newCommentId = result.insertId; // 삽입된 comment_id 값
        res.json({ message: '댓글이 작성되었습니다.', comment_id: newCommentId, target_id, nickname, comment });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




//전체 댓글 조회
app.get('/comments', async (req, res) => {
  const selectQuery = 'SELECT * FROM comments';

  try {
    await connection.query(selectQuery, (err, results) => {
      if (err) {
        throw new Error('Internal Server Error');
      } else {
        res.status(200).json(results);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// 댓글 삭제 API
app.delete('/comment/:comment_id', async (req, res) => {
  const { comment_id } = req.params;
  const { password } = req.body;
  const selectQuery = 'SELECT * FROM comments WHERE comment_id = ?';
  const deleteQuery = 'DELETE FROM comments WHERE comment_id = ?';

  try {
    await connection.query(selectQuery, [comment_id], async (selectErr, selectResults) => {
      if (selectErr) {
        throw new Error('Internal Server Error');
      }

      if (selectResults.length === 0) {
        res.status(404).json({ message: 'Comment not found' });
        return;
      }

      const comment = selectResults[0];

      if (comment.password !== password) {
        res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
        return;
      }

      await connection.query(deleteQuery, [comment_id], (deleteErr) => {
        if (deleteErr) {
          throw new Error('Internal Server Error');
        }
        res.json({ message: '댓글이 삭제되었습니다.' });
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 서버 시작
const port = 30382;
app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
