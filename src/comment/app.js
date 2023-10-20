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
  'https://web-bu-web-exhibition-fq2r52kllqhhlnh.sel3.cloudtype.app',
  'http://bu-webdesign.site',
  'http://127.0.0.1:5500'
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
  const sql = 'SELECT * FROM users;'; // users 테이블의 모든 열을 선택하는 SQL 쿼리

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


// /users/:id 경로로 GET 요청 처리
app.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const userSql = 'SELECT * FROM users WHERE id = ?';
    const worksSql = 'SELECT * FROM works WHERE work_id = ?'; // 변경된 SQL
    const commentsSql = 'SELECT * FROM comments WHERE target_id = ?'; // 변경된 SQL

    // 데이터베이스 쿼리 실행 (query 함수는 여기에서 정의되어야 함)
    const [userResults, worksResults, commentsResults] = await Promise.all([
      query(userSql, [userId]),
      query(worksSql, [userId]),
      query(commentsSql, [userId]),
    ]);

    const userData = userResults[0];
    const worksData = worksResults;
    const commentsData = commentsResults;

    const combinedData = {
      user: userData,
      works: worksData,
      comments: commentsData,
    };

    res.json(combinedData); // 결과를 JSON 형태로 응답
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// query 함수 정의
function query(sql, values) {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}



// /works 경로로 GET 요청 처리
app.get('/works', (req, res) => {
  const sql = 'SELECT work_id, work_order, workthumb, workname, workintro, workimg, workbody, weblink, prototypelink, link, usetool_1, usetool_2, usetool_3, usetool_4, usetool_5 FROM works;'; // users 테이블의 모든 열을 선택하는 SQL 쿼리

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


app.get('/works/:work_id', cors(corsOptions), function (req, res, next) {
  res.json({ msg: 'https://web-bu-web-exhibition-fq2r52kllqhhlnh.sel3.cloudtype.app 규칙인 Origin에 대하여 개방' })
});




// 댓글 작성 API
app.post('/comments', cors(corsOptions), async (req, res) => {
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


// target 댓글 조회
app.get('/comments/target/:target_id', cors(corsOptions), async (req, res) => {
  const targetId = req.params.target_id;
  const selectQuery = 'SELECT * FROM comments WHERE target_id = ?';

  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(selectQuery, [targetId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// 댓글 삭제 API
app.delete('/comments/:comment_id', cors(corsOptions), async (req, res) => {
  const { comment_id } = req.params;
  const { password } = req.body;
  const selectQuery = 'SELECT * FROM comments WHERE comment_id = ?';
  const deleteQuery = 'DELETE FROM comments WHERE comment_id = ?';


  try {
    const selectResults = await new Promise((resolve, reject) => {
      connection.query(selectQuery, [comment_id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    if (selectResults.length === 0) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    const comment = selectResults[0];

    if (comment.password !== password) {
      res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
      return;
    }

    await new Promise((resolve, reject) => {
      connection.query(deleteQuery, [comment_id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    res.json({ message: '댓글이 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// 방명록 작성 API
app.post('/guestbooks', cors(corsOptions), async (req, res) => {
  const { guestname, password, guestbook } = req.body;
  const insertQuery = 'INSERT INTO guestbooks (guestname, password, guestbook) VALUES (?, ?, ?)';

  connection.query(insertQuery, [guestname, password, guestbook], (err, result) => {
    if (err) {
      console.error('Error creating comment:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      const newGuestbookId = result.insertId; // 삽입된 comment_id 값
      res.json({ message: '댓글이 작성되었습니다.', guestbook_id: newGuestbookId, guestname, guestbook });
    }
  });
});


//방명록 조회
app.get('/guestbooks', async (req, res) => {
  const selectQuery = 'SELECT * FROM guestbooks';

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


// 방명록 삭제 API
app.delete('/guestbooks/:guestbook_id', cors(corsOptions), async (req, res) => {
  const { guestbook_id } = req.params;
  const { password } = req.body;
  const selectQuery = 'SELECT * FROM guestbooks WHERE guestbook_id = ?';
  const deleteQuery = 'DELETE FROM guestbooks WHERE guestbook_id = ?';


  try {
    const selectResults = await new Promise((resolve, reject) => {
      connection.query(selectQuery, [guestbook_id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    if (selectResults.length === 0) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    const guestbook = selectResults[0];

    if (guestbook.password !== password) {
      res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
      return;
    }

    await new Promise((resolve, reject) => {
      connection.query(deleteQuery, [guestbook_id], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    res.json({ message: '댓글이 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});










// 서버 시작
const port = 30382;
app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
