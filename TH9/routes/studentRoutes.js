const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/studentController");
const { requireLogin } = require("../middleware/authMiddleware");

// bảo vệ toàn bộ API
router.use(requireLogin);

router.get("/stats", ctrl.stats);
router.get("/stats/class", ctrl.statsByClass);

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;