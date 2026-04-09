const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController'); // Đã sửa lỗi đường dẫn dấu ..

router.get('/', postController.index);
router.get('/new', postController.create);
router.post('/store', postController.store);
router.get('/:id', postController.detail);
router.get('/edit/:id', postController.edit);
router.put('/update/:id', postController.update); // Method PUT
router.delete('/delete/:id', postController.delete); // Method DELETE

module.exports = router;