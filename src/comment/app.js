const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise'); // mysql2 사용
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const dbConfig = {
  host: 'svc.sel3.cloudtype.app',
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
};

app.use(cors(corsOptions));

// MariaDB 연결
const pool = mysql.createPool(dbConfig);




// 댓글 생성 API
app.post('/comments', async (req, res) => {
  try {
    const { target_id, nickname, password, comment } = req.body;
    const created_at = new Date();

    const connection = await pool.getConnection();
    const query = `
      INSERT INTO comments (target_id, nickname, password, comment, created_at)
      VALUES (?, ?, ?, ?, ?)
    `;

    await connection.query(query, [target_id, nickname, password, comment, created_at]);
    connection.release();

    res.json({ message: '댓글이 생성되었습니다.' });
  } catch (error) {
    console.error('댓글 생성 오류:', error);
    res.status(500).json({ message: '댓글 생성에 실패했습니다.' });
  }
});

// 댓글 조회 API
app.get('/comments/:target_id', async (req, res) => {
  try {
    const target_id = req.params.target_id;

    const connection = await pool.getConnection();
    const query = 'SELECT * FROM comments WHERE target_id = ?';

    const [rows] = await connection.query(query, [target_id]);
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error('댓글 조회 오류:', error);
    res.status(500).json({ message: '댓글 조회에 실패했습니다.' });
  }
});

// /users 경로로 GET 요청 처리
app.get('/users', async (req, res) => {
  const sql = 'SELECT * FROM users'; // users 테이블의 모든 열을 선택하는 SQL 쿼리

  try {
    const [results] = await pool.query(sql);
    res.json(results);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// 서버 시작
const port = 5000;
app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
