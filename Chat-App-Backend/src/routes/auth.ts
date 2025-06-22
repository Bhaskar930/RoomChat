import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"],
}));

router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const user = req.user!;
    //@ts-ignore
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.redirect(`${process.env.CLIENT_URL}/google-success?token=${token}`);
  }
);

export default router;
