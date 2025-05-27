const express = require("express");
const mysql = require("mysql2/promise"); // 使用 mysql2/promise 模組
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// 建立 MySQL2 連接池
const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "qwe",
  database: "user",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get("/", (req, res) => {
  res.render('index', { title: 'Express' });
});

app.get("/users", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM user");
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/tables", async (req, res) => {
  const table_name = req.body[0].table_name;
  const columns = Object.keys(req.body[0]).filter(key => key !== "table_name");;
  const rows = req.body.map(row => columns.map(field => row[field]));

  if (!table_name || !columns.length || !rows.length) {
    return res.status(400).json({ message: "Invalid data" });
  }

  const connection = await db.getConnection(); // 使用 MySQL2 連接池的 getConnection 方法
  await connection.beginTransaction(); // 開啟交易

  try {
    // **Step 1: 建立表格**
    const [tableResult] = await connection.query(
      "INSERT INTO tables (name) VALUES (?)", [table_name]
    );
    const tableId = tableResult.insertId;

    // **Step 2: 插入欄位**
    const columnMap = {};
    for (const col of columns) {
      const [colResult] = await connection.query(
        "INSERT INTO columns (table_id, column_name) VALUES (?, ?)", [tableId, col]
      );
      columnMap[col] = colResult.insertId; // 存欄位 ID
    }

    // **Step 3: 插入行與資料**
    for (const row of rows) {
      const [rowResult] = await connection.query(
        "INSERT INTO `rows` (table_id) VALUES (?)", [tableId]
      );
      const rowId = rowResult.insertId;

      for (let i = 0; i < columns.length; i++) {
        await connection.query(
          "INSERT INTO data (row_id, column_id, value) VALUES (?, ?, ?)",
          [rowId, columnMap[columns[i]], row[i]]
        );
      }
    }

    await connection.commit(); // **提交交易**
    res.status(201).json({ message: "Table saved successfully", table_id: tableId });

  } catch (error) {
    await connection.rollback(); // **發生錯誤時回滾**
    console.error(error);
    res.status(500).json({ message: "Database error" });
  } finally {
    connection.release(); // **釋放連線**
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
