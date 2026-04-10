import mongoose from "mongoose";

const ConsultationSchema = new mongoose.Schema({
  patient_id: String,
  doctor_id: String,
  patient_name: String,
  age: Number,
  gender: String,
  vitals: {
    height: Number,
    weight: Number,
    bmi: Number,
    heart_rate: Number,
    bp: String
  },
  symptoms: [String],
  predictions: [
    {
      disease: String,
      probability: Number
    }
  ],
  doctor_confirmed_disease: String,
  created_at: Date
});

export default mongoose.model("Consultations", ConsultationSchema);