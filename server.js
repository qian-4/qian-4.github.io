// server.js (教育用デモ)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

// デモ用 CORS / JSON
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // index.html 等を public に置く

// ダミー職員アカウント（教育用）
const demoUser = { username: 'demo.officer', password: 'demo123', role: 'admin' };

// ダミー逮捕状データ
let warrants = [
  { id: "A-2025-0001", name: "山田 太郎", issued: "2025-10-01", status: "issued", officer: "田中" },
  { id: "A-2025-0002", name: "佐藤 花子", issued: "2025-09-20", status: "executed", officer: "佐々木" },
  { id: "A-2025-0003", name: "鈴木 次郎", issued: "2025-08-15", status: "cancelled", officer: "高橋" }
];

// --- デモ用ログイン ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if(username === demoUser.username && password === demoUser.password){
    res.json({ success: true, username: demoUser.username, role: demoUser.role });
  } else {
    res.json({ success: false, message: '認証失敗（デモ）' });
  }
});

// --- 逮捕状一覧取得 ---
app.get('/api/warrants', (req, res) => {
  res.json(warrants);
});

// --- 新規逮捕状追加 ---
app.post('/api/warrants', (req, res) => {
  const { id, name, issued, officer } = req.body;
  const newWarrant = { id, name, issued, status: 'issued', officer };
  warrants.unshift(newWarrant);
  res.json({ success: true, warrant: newWarrant });
});

// --- CSV ダウンロード（デモ） ---
app.get('/api/export', (req, res) => {
  const csv = warrants.map(w => `${w.id},${w.name},${w.issued},${w.status},${w.officer}`).join('\n');
  res.header('Content-Type', 'text/csv');
  res.attachment('warrants_export.csv');
  res.send(csv);
});

app.listen(PORT, () => {
  console.log(`教育用デモサーバー起動: http://localhost:${PORT}`);
});
