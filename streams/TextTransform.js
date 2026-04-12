const { Transform } = require('stream');

class TextTransform extends Transform {
    _transform(chunk, encoding, callback) {
        // Chuyển nội dung sang chữ hoa
        this.push(chunk.toString().toUpperCase());
        callback();
    }
}

module.exports = TextTransform;