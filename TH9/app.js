const express = require("express");
const session = require("express-session");

const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
}));

// logger
const logger = require("./middleware/loggerMiddleware");
app.use(logger);

// ===== ROUTES =====
app.use("/", require("./routes/authRoutes"));
app.use("/students", require("./routes/studentRoutes"));

// ===== HEAVY API =====

// SYNC (blocking)
app.get("/heavy-sync", (req, res) => {
    let sum = 0;
    for (let i = 0; i < 1e9; i++) sum++;
    res.json({ message: "Done sync" });
});

// ASYNC (non-blocking)
app.get("/heavy-async", (req, res) => {
    setTimeout(() => {
        res.json({ message: "Done async" });
    }, 3000);
});

// ===== ERROR HANDLER =====
const errorHandler = require("./middleware/errorMiddleware");
app.use(errorHandler);

// ===== START SERVER =====
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});