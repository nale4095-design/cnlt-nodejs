const http = require('http');

const server = http.createServer((req, res) => {
    const url = req.url;

    // Sử dụng if-else và chỉ gọi writeHead bên trong từng nhánh
    if (url === '/' || url === '/home') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Trang chủ: Chào mừng bạn đến với Node.js Server của Nana!');
    } 
    else if (url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Trang giới thiệu: Đây là dự án thực hành Node.js đầu tiên của mình.');
    } 
    else if (url === '/contact') {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Trang liên hệ: Email của mình là nale4095@gmail.com');
    } 
    else {
        // Chỉ khi không khớp các đường dẫn trên mới gửi lỗi 404
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 - Không tìm thấy trang');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});