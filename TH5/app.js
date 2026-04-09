const express = require('express');
const connectDB = require('./config/db');
const methodOverride = require('method-override');
const postRoutes = require('./routes/postRoutes');
const path = require('path'); // Nên thêm path để xử lý đường dẫn chuẩn hơn

const app = express();

// Kết nối DB
connectDB();

// --- MIDDLEWARE ---
// 1. Dòng này cực kỳ quan trọng để nhận diện file CSS/Image trong thư mục public
app.use(express.static('public')); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method')); 

// Cấu hình View
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views')); // Optional: Đảm bảo trỏ đúng thư mục views

// --- ROUTES ---
app.use('/blogposts', postRoutes);

// Trang chủ tự động chuyển hướng
app.get('/', (req, res) => res.redirect('/blogposts'));

app.listen(3000, () => {
    console.log('Server đang chạy tại http://localhost:3000');
});