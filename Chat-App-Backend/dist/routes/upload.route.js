"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_middleware_1 = require("../middleware/multer.middleware");
const upload_controller_1 = require("../controllers/upload.controller");
const router = express_1.default.Router();
//@ts-ignore
router.post("/", multer_middleware_1.upload.single("file"), upload_controller_1.uploadFile);
exports.default = router;
