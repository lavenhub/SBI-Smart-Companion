"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadSingle = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const constants_1 = require("../constants");
const errors_1 = require("../utils/errors");
// Use memory storage — StorageService handles the write
const storage = multer_1.default.memoryStorage();
function fileFilter(req, file, cb) {
    if (constants_1.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new errors_1.ValidationError(`File type '${file.mimetype}' is not allowed`));
    }
}
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: constants_1.MAX_FILE_SIZE_BYTES,
        files: 5,
    },
});
exports.uploadSingle = exports.upload.single('file');
exports.uploadMultiple = exports.upload.array('files', 5);
//# sourceMappingURL=upload.middleware.js.map