const express = require("express");
const router = express.Router();
const DiaryEntry = require("../models/DiaryEntry");
const authMiddleware = require("../middleware/auth");

// POST /api/entries – Add new diary entry
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { mood, intensity, text } = req.body;
    const newEntry = new DiaryEntry({
      userId: req.userId,
      mood,
      intensity: intensity || 5, // default to 5 if not provided
      text,
    });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// GET /api/entries – Fetch all diary entries for the user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const entries = await DiaryEntry.find({ userId: req.userId }).sort({ date: -1 });
    res.status(200).json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// PUT /api/entries/:id – Update existing diary entry
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { mood, intensity, text } = req.body;
    const entry = await DiaryEntry.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!entry) {
      return res.status(404).json({ message: "Entry not found." });
    }
    
    entry.mood = mood;
    entry.intensity = intensity || entry.intensity; // keep existing if not provided
    entry.text = text;
    entry.date = new Date(); // Update the date to current time
    
    await entry.save();
    res.status(200).json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// DELETE /api/entries/:id – Delete diary entry
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const entry = await DiaryEntry.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!entry) {
      return res.status(404).json({ message: "Entry not found." });
    }
    
    res.status(200).json({ message: "Entry deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
