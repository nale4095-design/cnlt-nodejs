const students = require("../data/students");

let idCounter = 3;

// VALIDATION
const validate = (data) => {
    if (!data.name || data.name.length < 2)
        return "Tên >= 2 ký tự";

    if (!/^\S+@\S+\.\S+$/.test(data.email))
        return "Email không hợp lệ";

    if (students.find(s => s.email === data.email && !s.isDeleted))
        return "Email đã tồn tại";

    if (data.age < 16 || data.age > 60)
        return "Tuổi 16-60";

    return null;
};

// GET ALL
exports.getAll = (req, res) => {
    let result = students.filter(s => !s.isDeleted);

    const { name, class: cls, sort, page = 1, limit = 10 } = req.query;

    if (name) result = result.filter(s => s.name.includes(name));
    if (cls) result = result.filter(s => s.class === cls);

    if (sort === "age_desc")
        result.sort((a, b) => b.age - a.age);

    const total = result.length;

    const start = (page - 1) * limit;
    const data = result.slice(start, start + parseInt(limit));

    res.json({ page: +page, limit: +limit, total, data });
};

// GET BY ID
exports.getById = (req, res) => {
    const student = students.find(s => s.id == req.params.id && !s.isDeleted);
    if (!student) return res.status(404).json({ message: "Not found" });

    res.json(student);
};

// CREATE
exports.create = (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).json({ message: error });

    const newStudent = {
        id: idCounter++,
        ...req.body,
        isDeleted: false
    };

    students.push(newStudent);
    res.json(newStudent);
};

// UPDATE
exports.update = (req, res) => {
    const student = students.find(s => s.id == req.params.id && !s.isDeleted);
    if (!student) return res.status(404).json({ message: "Not found" });

    Object.assign(student, req.body);
    res.json(student);
};

// DELETE (soft)
exports.remove = (req, res) => {
    const student = students.find(s => s.id == req.params.id);
    if (!student) return res.status(404).json({ message: "Not found" });

    student.isDeleted = true;
    res.json({ message: "Deleted" });
};

// STATS
exports.stats = (req, res) => {
    const total = students.length;
    const active = students.filter(s => !s.isDeleted).length;
    const deleted = students.filter(s => s.isDeleted).length;

    const avg =
        students.filter(s => !s.isDeleted)
        .reduce((sum, s) => sum + s.age, 0) / active || 0;

    res.json({ total, active, deleted, averageAge: avg });
};

// STATS BY CLASS
exports.statsByClass = (req, res) => {
    const result = {};

    students.filter(s => !s.isDeleted).forEach(s => {
        result[s.class] = (result[s.class] || 0) + 1;
    });

    const data = Object.keys(result).map(c => ({
        class: c,
        count: result[c]
    }));

    res.json(data);
};