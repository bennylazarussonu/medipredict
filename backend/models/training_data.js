import mongoose from "mongoose";

const TrainingDataSchema = new mongoose.Schema({
  symptoms: [
    {
      type: String,
      required: true
    }
  ],

  symptom_vector: [
    {
      type: Number
    }
  ],

  age: Number,
  gender: String,

  vitals: {
    height: Number,
    weight: Number,
    bmi: Number,
    heart_rate: Number,
    bp: String
  },

  true_disease: {
    type: String,
    required: true
  },

  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("TrainingData", TrainingDataSchema);