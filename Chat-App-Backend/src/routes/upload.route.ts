import express from "express";
import { upload } from "../middleware/multer.middleware";
import { uploadFile } from "../controllers/upload.controller";

const router = express.Router();

//@ts-ignore
router.post("/", upload.single("file"), uploadFile);

export default router;
