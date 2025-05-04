import express from "express";
const router = express.Router();

// Example controller or direct handler
router.post("/register", (req, res) => {
  res.status(200).json({ message: "User registered successfully" });
});

export default router;
