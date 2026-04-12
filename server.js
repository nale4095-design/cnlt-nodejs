const http = require('http');
const fs = require('fs');
const path = require('path');
const appEmitter = require('./events/AppEmitter');
const TextTransform = require('./streams/TextTransform');

// 1. Lắng nghe sự kiện hệ thống
appEmitter.on('visit', (data) => {
    const logMsg = `[${data.time}] Trang: ${data.page}\n`;
    const logPath = path.join(__dirname, 'data', 'log.txt');
    
    // Đảm bảo thư mục data tồn tại
    if (!fs.existsSync(path.join(__dirname, 'data'))) fs.mkdirSync(path.join(__dirname, 'data'));
    
    fs.appendFileSync(logPath, logMsg);
    console.log(logMsg);
});

const server = http.createServer((req, res) => {
    const baseURL = `http://${req.headers.host}`;
    const myUrl = new URL(req.url, baseURL);
    const pathname = myUrl.pathname;

    // --- XỬ LÝ FILE TĨNH (CSS & IMAGE) ---
    if (pathname === '/style.css') {
        const cssPath = path.join(__dirname, 'public', 'style.css');
        if (fs.existsSync(cssPath)) {
            res.writeHead(200, { 'Content-Type': 'text/css' });
            return fs.createReadStream(cssPath).pipe(res);
        }
    }

    if (pathname === '/stream-image') {
        // Sử dụng file demo.jpg bạn vừa gửi
        const imagePath = path.join(__dirname, 'public', 'images', 'demo.jpg');
        if (fs.existsSync(imagePath)) {
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            const imgStream = fs.createReadStream(imagePath);
            imgStream.on('error', () => res.end());
            return imgStream.pipe(res);
        } else {
            res.writeHead(404);
            return res.end("Khong tim thay file public/images/demo.jpg");
        }
    }

    // --- ROUTING CÁC TRANG ---
    switch (pathname) {
        case '/':
            appEmitter.logActivity('Trang chủ');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            fs.createReadStream(path.join(__dirname, 'views', 'index.html')).pipe(res);
            break;

        case '/events':
            appEmitter.logActivity('Events');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            fs.createReadStream(path.join(__dirname, 'views', 'events.html')).pipe(res);
            break;

        case '/request':
            appEmitter.logActivity('Request');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            fs.createReadStream(path.join(__dirname, 'views', 'request.html')).pipe(res);
            break;

        case '/json-info':
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ url: req.url, method: req.method, headers: req.headers }, null, 2));
            break;

        case '/streams':
            appEmitter.logActivity('Streams');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            fs.createReadStream(path.join(__dirname, 'views', 'streams.html')).pipe(res);
            
            // Thực hiện Transform Stream ngầm
            const storyPath = path.join(__dirname, 'data', 'story.txt');
            if (fs.existsSync(storyPath)) {
                const transformer = new TextTransform();
                const logWriter = fs.createWriteStream(path.join(__dirname, 'data', 'log.txt'), { flags: 'a' });
                fs.createReadStream(storyPath).pipe(transformer).pipe(logWriter);
            }
            break;

        case '/download-log':
            const logPath = path.join(__dirname, 'data', 'log.txt');
            if (fs.existsSync(logPath)) {
                res.setHeader('Content-Disposition', 'attachment; filename=log.txt');
                fs.createReadStream(logPath).pipe(res);
            } else {
                res.end("Chưa có file log.");
            }
            break;

        default:
            res.writeHead(404);
            res.end('<h1>404 Not Found</h1>');
    }
});

server.listen(3000, () => console.log('Server running at http://localhost:3000'));