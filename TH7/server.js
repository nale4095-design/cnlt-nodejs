const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((req, res) => {
    // Phân tích URL truyền lên
    let urlData = url.parse(req.url, true);
    
    // Xác định đường dẫn tệp trong thư mục views
    let fileName = './views' + urlData.pathname;

    // Nếu truy cập đường dẫn gốc, mặc định trả về index.html
    if (urlData.pathname === '/') {
        fileName = './views/index.html';
    }

    // Đọc tệp tin từ hệ thống
    fs.readFile(fileName, (err, data) => {
        if (err) {
            // Trả về lỗi 404 nếu không tìm thấy tệp
            console.log(err);
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write('404 Not Found');
            return res.end();
        }

        // Trả về nội dung tệp với mã trạng thái 200 (Thành công)
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
});

// Lắng nghe tại cổng 8017
server.listen(8017, 'localhost', () => {
    console.log('Server is running at http://localhost:8017/');
});