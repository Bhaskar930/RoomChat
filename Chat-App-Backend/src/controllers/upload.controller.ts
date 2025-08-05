import { Request, Response } from "express";

export const uploadFile = (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  res.status(200).json({
    url: `http://localhost:5000/uploads/${req.file.filename}`,
    filename: req.file.originalname,
  });
};
