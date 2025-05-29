// backend/index.js
import express from 'express';
import cors from 'cors'
import mysql from 'mysql2'

const app = express();
app.use(cors());
app.use(express.json());

// 建立 MySQL 連線
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'qwe',
  database: 'user',
  port: 3306,
});

// 測試連線
connection.connect((err) => {
  if (err) throw err;
  console.log('✅ Connected to MySQL');
});

// 新增使用者
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  connection.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: results.insertId, name, email });
    }
  );
});

// 取得使用者列表
// app.get('/api/users', (req, res) => {
//   connection.query('SELECT * FROM users', (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(results);
//     console.log(result)
//   });
// });

app.get("/", (req, res) => {
  res.render('index', { title: 'Express' });
});

app.get("/api/users", (req, res) => {
    console.log(req)
  try {
    const [results] = connection.query("SELECT * FROM user");
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.listen(3001, () => {
  console.log('🚀 Server is running on http://localhost:3001');
});
