const mongoose = require("mongoose");

const DiaryEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mood: { type: String, required: true }, // happy, sad, angry, etc.
  intensity: { type: Number, min: 1, max: 10, default: 5 }, // mood intensity 1-10
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("DiaryEntry", DiaryEntrySchema);
