const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 8017;

// --- CẤU HÌNH LƯU TRỮ (MULTER DISK STORAGE) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "uploads";
        // Tự động tạo thư mục uploads nếu chưa có
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // GIẢI QUYẾT LỖI PHÔNG CHỮ: Chuyển đổi mã hóa từ latin1 sang utf8
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        
        // Đặt tên file kèm theo timestamp để tránh trùng lặp
        cb(null, Date.now() + "-" + originalName);
    }
});

// Khởi tạo middleware multer với cấu hình storage
const upload = multer({ storage: storage });

// --- CÁC ROUTE XỬ LÝ ---

// 1. Giao diện trang chủ
app.get("/", (req, res) => {
    // Trả về file master.html trong thư mục views
    res.sendFile(path.join(__dirname, "views", "master.html"));
});

// 2. Xử lý Upload 1 file
app.post("/upload", upload.single("file"), (req, res) => { 
    if (!req.file) {
        return res.send("Lỗi: Chưa chọn file để upload");
    }
    console.log("Đã nhận file:", req.file.filename);
    res.send(`Upload đơn thành công: ${req.file.filename}`);
});

// 3. Xử lý Upload NHIỀU file (Tối đa 17 file)
app.post("/upload-multiple", upload.array("many-files", 17), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.send("Lỗi: Chưa chọn file nào");
    }
    console.log(`Đã nhận ${req.files.length} files`);
    res.send(`Upload nhiều file thành công. Số lượng: ${req.files.length}`);
});

// --- KHỞI CHẠY SERVER ---
app.listen(port, () => {
    console.log(`Server chạy tại http://localhost:${port}`);
});