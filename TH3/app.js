const express = require('express');
const app = express();
const path = require('path');

// 1. Cấu hình Template Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', './views');

// 2. Cấu hình phục vụ file tĩnh
// Khi dùng dòng này, mọi file trong /public sẽ được truy cập trực tiếp từ gốc "/"
// Ví dụ: public/css/styles.css sẽ gọi là /css/styles.css
app.use(express.static('public'));

// 3. Dữ liệu mẫu (Đặt ở ngoài để các Route đều dùng được)
const items = [
    { id: 1, name: 'iPhone 15 Pro Max', description: 'Điện thoại cao cấp nhất của Apple năm 2023.', price: '30.000.000', hot: true },
    { id: 2, name: 'Samsung Galaxy S24', description: 'Flagship mới nhất với công nghệ AI từ Samsung.', price: '22.000.000', hot: false },
    { id: 3, name: 'MacBook M3 Air', description: 'Laptop mỏng nhẹ, hiệu năng cực khủng với chip M3.', price: '28.000.000', hot: true },
    { id: 4, name: 'Sony WH-1000XM5', description: 'Tai nghe chống ồn tốt nhất thế giới hiện nay.', price: '7.000.000', hot: false },
    { id: 5, name: 'iPad Pro M2', description: 'Máy tính bảng mạnh mẽ thay thế hoàn toàn laptop.', price: '20.000.000', hot: true }
];

// 4. Các Route theo yêu cầu bài thực hành

// Trang chủ
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Trang chủ - Tech Review' 
    });
});

// Trang danh sách (Sử dụng dữ liệu mảng và vòng lặp trong EJS)
app.get('/list', (req, res) => {
    res.render('list', { 
        title: 'Danh sách sản phẩm',
        danhSach: items 
    });
});

// Trang chi tiết (Route động :id)
app.get('/detail/:id', (req, res) => {
    const id = parseInt(req.params.id); // Lấy ID từ URL
    const item = items.find(x => x.id === id); // Tìm sản phẩm khớp ID
    
    if (!item) {
        return res.status(404).send('Không tìm thấy sản phẩm này!');
    }
    
    res.render('detail', { 
        title: 'Chi tiết: ' + item.name,
        item: item 
    });
});

// Trang liên hệ
app.get('/contact', (req, res) => {
    res.render('contact', { 
        title: 'Liên hệ với chúng tôi' 
    });
});

// 5. Khởi chạy Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`==============================================`);
    console.log(`Sơ đồ các trang web:`);
    console.log(`1. Trang chủ:    http://localhost:${PORT}/`);
    console.log(`2. Danh sách:    http://localhost:${PORT}/list`);
    console.log(`3. Chi tiết:     http://localhost:${PORT}/detail`);
    console.log(`4. Liên hệ:      http://localhost:${PORT}/contact`);
    console.log(`==============================================`);
});