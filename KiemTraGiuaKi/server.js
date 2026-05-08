const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = {};

// Khi user kết nối
io.on("connection", (socket) => {

    // User đăng nhập
    socket.on("join", (username) => {

        users[socket.id] = username;

        // Gửi danh sách online
        io.emit("onlineUsers", users);
    });

    // Gửi tin nhắn riêng
    socket.on("privateMessage", (data) => {

        io.to(data.to).emit("message", {
            sender: users[socket.id],
            message: data.message,
            time: new Date().toLocaleTimeString()
        });

        // Hiện lại bên người gửi
        socket.emit("myMessage", {
            receiver: users[data.to],
            message: data.message,
            time: new Date().toLocaleTimeString()
        });
    });

    // User thoát
    socket.on("disconnect", () => {

        delete users[socket.id];

        io.emit("onlineUsers", users);
    });
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});