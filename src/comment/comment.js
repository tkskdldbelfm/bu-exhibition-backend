const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise'); // mysql2 사용
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dbConfig = {
  host: 'exhibitiondb',
  user: 'gwang',
  password: 'Dlrhkddnjs1!',
  database: 'exhibitiondata'
};

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

// 서버 시작
const port = 3306;
app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});

app.use(cors());