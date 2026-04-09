const express = require('express');
const path = require('path'); // thêm dòng này
const app = express();
const PORT = 4000;

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// route trang chủ (chuẩn hơn)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// thêm route cho các trang khác
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/post', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'post.html'));
});

// chạy server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});