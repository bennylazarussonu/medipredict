import mongoose from "mongoose";

const SymptomSchema = new mongoose.Schema({
  symptom_name: {
    type: String,
    required: true,
    unique: true
  },
  index: {
    type: Number,
    required: true,
    unique: true
  },
  description: {
    type: String
  }
});

export default mongoose.model("Symptoms", SymptomSchema);