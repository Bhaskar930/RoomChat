"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const uploadFile = (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: "No file uploaded" });
    res.status(200).json({
        url: `http://localhost:5000/uploads/${req.file.filename}`,
        filename: req.file.originalname,
    });
};
exports.uploadFile = uploadFile;
